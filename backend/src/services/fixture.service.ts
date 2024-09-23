import { Fixture, TournamentType } from '@prisma/client';
import { generateLeagueFixtures } from '../fixtures/league';
import { prisma } from '../db';
import { generateKnockoutFixtures } from '../fixtures/knockout';

export const saveFixtureScore = async (
  fixtureId: number,
  { homeScore, awayScore }: { homeScore: number; awayScore: number },
) => {
  const updatedFixture = await prisma.fixture.update({
    where: {
      id: fixtureId,
    },
    include: {
      tournament: true,
    },
    data: {
      homeScore,
      awayScore,
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
      await saveGenerateKnockoutFixtures(round + 1, {
        numOfLegs: updatedFixture.tournament.numOfLegs,
        tournamentId: updatedFixture.tournamentId,
        playerIds: roundWinners,
      });
    }
  }
  return updatedFixture;
};

type DBFixtureInput = Omit<Fixture, 'id' | 'createdAt'>;

type SaveGeneratedFixtures = {
  playerIds: number[];
  tournamentId: number;
  numOfLegs: number;
};

export const saveGenerateKnockoutFixtures = (
  round: number,
  { playerIds, tournamentId, numOfLegs }: SaveGeneratedFixtures,
) => {
  const allNextKnockoutFixtures = generateKnockoutFixtures(
    playerIds.map((v) => v.toString()),
    numOfLegs,
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

export const saveGeneratedLeagueFixtures = ({
  playerIds,
  tournamentId,
  numOfLegs,
}: SaveGeneratedFixtures) => {
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
    const homeId = f.homeId || 0;
    const awayId = f.awayId || 0;
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
      homeId > awayId ? +f.awayScore! || 0 : +f.homeScore! || 0;
    result[id].playerB.scores +=
      awayId > homeId ? +f.awayScore! || 0 : +f.homeScore! || 0;
  });
  return Object.values(result).map((r) => {
    if (r.playerA.scores > r.playerB.scores) return r.playerA.id;
    return r.playerB.id;
  });
};
