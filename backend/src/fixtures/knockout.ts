import { shuffle } from 'lodash';
import { SYSTEM_PLAYER } from '../constants';

export const generateKnockoutFixtures = (matchPlayers: string[]) => {
  const players = shuffle(matchPlayers);
  const mid = Math.ceil(players.length / 2);
  let groupA = players.slice(0, mid);
  let groupB = players.slice(mid);
  groupA = ensurePowerOf2(groupA);
  groupB = ensurePowerOf2(groupB);
  return [...generateFixtures(groupA), ...generateFixtures(groupB)];
};

const generateFixtures = (players: string[]) => {
  let fixtures = [];
  for (let i = 0; i < players.length; i += 2) {
    fixtures.push([players[i], players[i + 1]]);
  }
  return fixtures;
};

const nextPowerOf2 = (n: number) => {
  return Math.pow(2, Math.ceil(Math.log2(n)));
};

const ensurePowerOf2 = (players: string[]) => {
  const nextPower = nextPowerOf2(players.length);
  while (players.length < nextPower) players.push(SYSTEM_PLAYER);
  return players;
};
