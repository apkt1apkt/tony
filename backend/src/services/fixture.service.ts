import { Fixture, TournamentType } from '@prisma/client';
import { generateLeagueFixtures } from '../fixtures/league';
import { prisma } from '../db';

export const saveFixtureScore = async (
  fixtureId: number,
  { homeScore, awayScore }: { homeScore: number; awayScore: number },
) => {
  return prisma.fixture.update({
    where: {
      id: fixtureId,
    },
    data: {
      homeScore,
      awayScore,
    },
  });
};

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
  const dbFixtures: Omit<Fixture, 'id' | 'createdAt'>[] = [];
  Object.entries(allFixtures).forEach(([round, fixtures]) => {
    fixtures.forEach((f) => {
      dbFixtures.push({
        awayId: +f[1],
        homeId: +f[0],
        round: +round,
        tournamentId,
        awayScore: null,
        homeScore: null,
      });
    });
  });
  return prisma.fixture.createMany({
    data: dbFixtures,
  });
};
