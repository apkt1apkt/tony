import { Fixture } from '@prisma/client';
import { generateLeagueFixtures } from '../fixtures/league';
import { prisma } from '../db';

export const saveFixtureScore = async (
  fixtureId: number,
  { homeScore, awayScore }: { homeScore: number; awayScore: number },
) => {
  const updatedFixture = await prisma.fixture.update({
    where: {
      id: fixtureId,
    },
    data: {
      homeScore,
      awayScore,
    },
  });
  const round = updatedFixture.round;
  await prisma.fixture.updateMany({
    where: {
      round,
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
      awayId: null,
      homeScore: null,
    },
    data: {
      awayScore: 0,
      homeScore: 3,
    },
  });
  return updatedFixture;
};

type DBFixtureInput = Omit<Fixture, 'id' | 'createdAt'>;

export const saveGeneratedLeagueFixtures = ({
  playerIds,
  tournamentId,
  numOfLegs,
}: {
  playerIds: number[];
  tournamentId: number;
  numOfLegs: number;
}) => {
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
