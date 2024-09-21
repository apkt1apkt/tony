import shuffle from 'lodash/shuffle';
import { generateLeagueFixtures } from './fixtures/league';
import { generateKnockoutFixtures } from './fixtures/knockout';

type Player = {
  name: string;
};

type PlayerStats = {
  numOfTournamentsPlayed?: number;
  numOfLeaguesWon?: number;
};

const players: Record<string, {}> = {};

const addPlayers = async (playerName: string) => {
  const name = playerName.toLowerCase();
  if (players[name]) throw new Error('player already exist');
  players[name] = {};
  return Object.keys(players);
};

const getPlayers = async () => {
  return Object.keys(players);
};

enum FixtureType {
  League = 'league',
  Knockout = 'knockout',
}

// Example: 9 players (which will automatically add 'System Player')
const players2 = [
  'Player 1',
  'Player 2',
  'Player 3',
  //   'Player 4',
  //   'Player 5',
  //   'Player 6',
  //   'Player 7',
  //   'Player 8',
  //   'Player 9',
];

const generateFixtures = async (
  type: FixtureType,
  players: string[],
  numOfLegs: number,
) => {
  switch (type) {
    case FixtureType.League:
      return generateLeagueFixtures(players, numOfLegs);
    case FixtureType.Knockout:
      return generateKnockoutFixtures(players);
    default: {
    }
  }
};

export const quickApp = async () => {
  await addPlayers('arnold');
  await addPlayers('prince');
  await addPlayers('kikie');
  await addPlayers('joe');

  const numOfLegs = 2;
  const allPlayers = await getPlayers();
  const fixtures = await generateFixtures(
    FixtureType.League,
    allPlayers,
    numOfLegs,
  );
};

quickApp();
