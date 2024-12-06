import { Fixture, TournamentType } from '@prisma/client';
import { generateLeagueFixtures } from '../fixtures/league';
import { prisma, PrismaTransaction } from '../db';
import { generateKnockoutFixtures } from '../fixtures/knockout';

type Score = {
  homeScore: number;
  awayScore: number;
};

export const editFixtureScore = async (fixtureId: number, score: Score) => {
  const updatedFixture = await prisma.fixture.update({
    where: {
      id: fixtureId,
    },
    data: {
      homeScore: score.homeScore,
      awayScore: score.awayScore,
    },
  });
  return updatedFixture;
};

export const saveFixtureScore = async (fixtureId: number, score: Score) => {
  return prisma.$transaction(async (prisma) => {
    const updatedFixture = await prisma.fixture.update({
      where: {
        id: fixtureId,
      },
      include: {
        tournament: true,
      },
      data: {
        homeScore: score.homeScore,
        awayScore: score.awayScore,
      },
    });
    const round = updatedFixture.round;
    if (updatedFixture.tournament?.type === TournamentType.League) {
      await prisma.fixture.updateMany({
        where: {
          round,
          tournamentId: updatedFixture.tournamentId,
          homeId: null,
          awayScore: null,
        },
        data: {
          homeScore: 0,
          awayScore: 3,
        },
      });
      await prisma.fixture.updateMany({
        where: {
          round,
          tournamentId: updatedFixture.tournamentId,
          awayId: null,
          homeScore: null,
        },
        data: {
          awayScore: 0,
          homeScore: 3,
        },
      });
    }
    if (updatedFixture.tournament?.type === TournamentType.Knockout) {
      if (updatedFixture.tournament?.numOfLegs === 1) {
        if (updatedFixture.awayScore === updatedFixture.homeScore)
          throw new Error('Scores cannot be a draw');
      } else {
        const reverseFixture = await prisma.fixture.findFirst({
          where: {
            round: updatedFixture.round,
            tournamentId: updatedFixture.tournamentId,
            homeId: updatedFixture.awayId,
            awayId: updatedFixture.homeId,
          },
        });
        if (!reverseFixture)
          throw new Error('There seems to be no reverse fixture for this draw');
        if (
          reverseFixture.homeScore !== null ||
          reverseFixture.awayScore !== null
        ) {
          if (
            sum(updatedFixture.awayScore, reverseFixture.homeScore) ===
            sum(updatedFixture.homeScore, reverseFixture.awayScore)
          ) {
            throw new Error('Both legs cannot equate to a draw');
          }
        }
      }
      const availableFixture = await prisma.fixture.findFirst({
        where: {
          round: updatedFixture.round,
          tournamentId: updatedFixture.tournamentId,
          OR: [
            {
              homeScore: null,
            },
            {
              awayScore: null,
            },
          ],
        },
      });
      if (!availableFixture) {
        const allFixturesOfRound = await prisma.fixture.findMany({
          where: {
            round: updatedFixture.round,
            tournamentId: updatedFixture.tournamentId,
          },
        });
        const roundWinners = getRoundWinners(allFixturesOfRound);
        await saveGenerateKnockoutFixtures(
          round + 1,
          {
            numOfLegs: updatedFixture.tournament.numOfLegs,
            tournamentId: updatedFixture.tournamentId,
            playerIds: roundWinners,
          },
          prisma,
          false,
        );
      }
    }
    return updatedFixture;
  });
};

type DBFixtureInput = Omit<Fixture, 'id' | 'createdAt'>;

type SaveGeneratedFixtures = {
  playerIds: number[];
  tournamentId: number;
  numOfLegs: number;
};

const sum = (...numbers: (number | null)[]) => {
  return numbers.reduce((a, c) => ensureNum(a) + ensureNum(c));
};

const ensureNum = (num: number | string | null) => Number(num) || 0;

export const saveGenerateKnockoutFixtures = (
  round: number,
  { playerIds, tournamentId, numOfLegs }: SaveGeneratedFixtures,
  prisma: PrismaTransaction,
  shouldShuffle: boolean,
) => {
  const allNextKnockoutFixtures = generateKnockoutFixtures(
    playerIds.map((v) => v.toString()),
    numOfLegs,
    shouldShuffle,
  );
  const dbFixtures: DBFixtureInput[] = [];
  allNextKnockoutFixtures.forEach((f) => {
    const res = {
      awayId: +f[1],
      homeId: +f[0],
      round,
      tournamentId,
      awayScore: null as number | null,
      homeScore: null as number | null,
    };
    if (isNaN(res.homeId) && isNaN(res.awayId)) {
      res.homeScore = 0;
      res.awayScore = 0;
    } else if (isNaN(res.homeId)) {
      res.homeScore = 0;
      res.awayScore = 3;
    } else if (isNaN(res.awayId)) {
      res.homeScore = 3;
      res.awayScore = 0;
    }
    dbFixtures.push(res);
  });
  return prisma.fixture.createMany({
    data: dbFixtures,
  });
};

export const saveGeneratedLeagueFixtures = (
  { playerIds, tournamentId, numOfLegs }: SaveGeneratedFixtures,
  prisma: PrismaTransaction,
) => {
  const allFixtures = generateLeagueFixtures(
    playerIds.map((v) => v.toString()),
    numOfLegs,
  );
  const dbFixtures: DBFixtureInput[] = [];
  Object.entries(allFixtures).forEach(([round, fixtures]) => {
    const fixturesWithActualPlayers: DBFixtureInput[] = [];
    const fixturesWithSystemPlayer: DBFixtureInput[] = [];
    fixtures.forEach((f) => {
      const res = {
        awayId: +f[1],
        homeId: +f[0],
        round: +round,
        tournamentId,
        awayScore: null,
        homeScore: null,
      };
      if (isNaN(res.homeId) || isNaN(res.awayId)) {
        fixturesWithSystemPlayer.push(res);
      } else fixturesWithActualPlayers.push(res);
    });
    dbFixtures.push(...fixturesWithActualPlayers, ...fixturesWithSystemPlayer);
  });
  return prisma.fixture.createMany({
    data: dbFixtures,
  });
};

const getRoundWinners = (fixtures?: Fixture[]) => {
  const result: Record<
    string,
    {
      id: string;
      playerA: { id: number; scores: number };
      playerB: { id: number; scores: number };
    }
  > = {};
  fixtures?.forEach((f) => {
    const homeId = ensureNum(f.homeId);
    const awayId = ensureNum(f.awayId);
    const id = homeId > awayId ? `${awayId}-${homeId}` : `${homeId}-${awayId}`;
    if (!result[id]) {
      result[id] = {
        id,
        playerA: {
          id: homeId > awayId ? awayId : homeId,
          scores: 0,
        },
        playerB: {
          id: awayId > homeId ? awayId : homeId,
          scores: 0,
        },
      };
    }
    result[id].playerA.scores +=
      homeId > awayId ? ensureNum(f.awayScore) : ensureNum(f.homeScore);
    result[id].playerB.scores +=
      awayId > homeId ? ensureNum(f.awayScore) : ensureNum(f.homeScore);
  });
  return Object.values(result).map((r) => {
    if (r.playerA.scores > r.playerB.scores) return r.playerA.id;
    return r.playerB.id;
  });
};
