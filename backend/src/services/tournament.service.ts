import { Tournament, TournamentStatus } from '@prisma/client';
import { prisma } from '../db';
import { saveGeneratedLeagueFixtures } from './fixture.service';

export const getTournaments = async () => {
  return prisma.tournament.findMany({
    orderBy: {
      id: 'desc',
    },
  });
};

export const getTournamentById = async (tournamentId: number) => {
  if (tournamentId === 0) return getLatestOnGoingTournament();
  const res = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
    include: {
      fixtures: {
        include: {
          away: true,
          home: true,
        },
      },
    },
  });
  if (res) return { ...res, standings: await calculateStandings(res.id) };
};

export const getLatestOnGoingTournament = async () => {
  const res = await prisma.tournament.findFirst({
    where: {
      status: TournamentStatus.OnGoing,
    },
    include: {
      fixtures: {
        include: {
          away: true,
          home: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  if (res) return { ...res, standings: await calculateStandings(res.id) };
};

export const createTournament = async (
  payload: Pick<Tournament, 'name' | 'type' | 'numOfLegs'>,
) => {
  const activePlayers = await prisma.player.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  const newTournament = await prisma.tournament.create({
    data: {
      name: payload.name,
      numOfPlayers: activePlayers.length,
      numOfLegs: payload.numOfLegs,
      type: payload.type,
      players: {
        connect: activePlayers.map((player) => ({ id: player.id })),
      },
    },
    include: {
      players: true,
    },
  });

  await saveGeneratedLeagueFixtures({
    playerIds: activePlayers.map((v) => v.id),
    numOfLegs: 2,
    tournamentId: newTournament.id,
  });
  return newTournament;
};

export const calculateStandings = async (tournamentId: number) => {
  const players = await prisma.player.findMany({
    where: {
      tournaments: {
        some: {
          id: tournamentId,
        },
      },
    },
    include: {
      fixturesHome: {
        where: {
          tournamentId: tournamentId,
        },
      },
      fixturesAway: {
        where: {
          tournamentId: tournamentId,
        },
      },
    },
  });

  const standings = players.map((player) => {
    const homeFixtures = player.fixturesHome;
    const awayFixtures = player.fixturesAway;

    // Combine home and away fixtures and sort them by round in descending order
    const allFixtures = [...homeFixtures, ...awayFixtures].sort(
      (a, b) => b.round - a.round,
    );

    let matchesPlayed = 0;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsScored = 0;
    let goalsConceded = 0;
    const form: string[] = [];

    allFixtures.forEach((fixture) => {
      if (fixture.homeId === player.id) {
        goalsScored += fixture.homeScore ?? 0;
        goalsConceded += fixture.awayScore ?? 0;

        if (fixture.homeScore !== null && fixture.awayScore !== null) {
          if (fixture.homeScore > fixture.awayScore) {
            wins++;
            form.push('W');
          } else if (fixture.homeScore === fixture.awayScore) {
            draws++;
            form.push('D');
          } else {
            losses++;
            form.push('L');
          }
          ++matchesPlayed;
        }
      } else if (fixture.awayId === player.id) {
        goalsScored += fixture.awayScore ?? 0;
        goalsConceded += fixture.homeScore ?? 0;

        if (fixture.homeScore !== null && fixture.awayScore !== null) {
          if (fixture.awayScore > fixture.homeScore) {
            wins++;
            form.push('W');
          } else if (fixture.awayScore === fixture.homeScore) {
            draws++;
            form.push('D');
          } else {
            losses++;
            form.push('L');
          }
          ++matchesPlayed;
        }
      }
    });

    // form is already in descending round order due to sorting above
    const recentForm = form.slice(0, 5); // Get the most recent 5 results

    const points = wins * 3 + draws * 1;
    const goalDifference = goalsScored - goalsConceded;

    return {
      player: player.name,
      matchesPlayed,
      wins,
      draws,
      losses,
      goalsScored,
      goalsConceded,
      points,
      goalDifference,
      form: recentForm,
      rank: 0,
    };
  });

  // Sort standings by points, goal difference, and goals scored
  standings.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }

    if (b.goalsScored !== a.goalsScored) {
      return b.goalsScored - a.goalsScored;
    }

    return 0;
  });

  // Assign ranks, with ties getting the same rank
  let rank = 1;
  for (let i = 0; i < standings.length; i++) {
    if (i > 0) {
      const prevPlayer = standings[i - 1];
      const currentPlayer = standings[i];
      if (
        currentPlayer.points === prevPlayer.points &&
        currentPlayer.goalDifference === prevPlayer.goalDifference &&
        currentPlayer.goalsScored === prevPlayer.goalsScored
      ) {
        currentPlayer.rank = prevPlayer.rank; // Same rank as previous player
      } else {
        currentPlayer.rank = rank;
      }
    } else {
      standings[i].rank = rank;
    }

    rank++;
  }

  return standings;
};
