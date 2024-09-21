import { shuffle } from 'lodash';
import { SYSTEM_PLAYER } from '../constants';

export const generateLeagueFixtures = (
  matchPlayers: string[],
  numberOfLegs: number,
) => {
  let players = shuffle(matchPlayers);
  if (players.length % 2 !== 0) players.push(SYSTEM_PLAYER);
  const numPlayers = players.length;
  const numMatchDays = numPlayers - 1;
  const matchDays: [string, string][][] = [];
  const doGeneration = (leg: number) => {
    for (let round = 0; round < numMatchDays; round++) {
      let matchDayFixtures: [string, string][] = [];
      for (let i = 0; i < numPlayers / 2; i++) {
        const player1 = players[i];
        const player2 = players[numPlayers - 1 - i];
        if (round % 2 === (leg === 1 ? 0 : 1))
          matchDayFixtures.push([player1, player2]);
        else matchDayFixtures.push([player2, player1]);
      }
      players = [players[0], ...players.slice(-1), ...players.slice(1, -1)];
      matchDays.push(matchDayFixtures);
    }
  };
  Array(numberOfLegs)
    .fill(0)
    .forEach((v, i) => doGeneration(i + 1));
  return Object.fromEntries(matchDays.map((d, i) => [i + 1, shuffle(d)]));
};
