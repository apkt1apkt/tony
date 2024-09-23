import { shuffle } from 'lodash';
import { SYSTEM_PLAYER } from '../constants';

export const generateKnockoutFixtures = (
  matchPlayers: string[],
  numOfLegs: number,
  shouldShuffle: boolean,
) => {
  const players = shouldShuffle ? shuffle(matchPlayers) : matchPlayers;
  const mid = Math.ceil(players.length / 2);
  let groupA = players.length <= 2 ? players : players.slice(0, mid);
  let groupB = players.length <= 2 ? [] : players.slice(mid);
  groupA = ensurePowerOf2(groupA);
  groupB = ensurePowerOf2(groupB);
  const groupAFixtures = generateFixtures(groupA, numOfLegs);
  const groupBFixtures = generateFixtures(groupB, numOfLegs);
  return [
    ...groupAFixtures.leg1Fixtures,
    ...groupBFixtures.leg1Fixtures,
    ...groupAFixtures.leg2Fixtures,
    ...groupBFixtures.leg2Fixtures,
  ];
};

const generateFixtures = (players: string[], numOfLegs: number) => {
  const leg1Fixtures = [];
  const leg2Fixtures = [];
  for (let i = 0; i < players.length; i += 2) {
    leg1Fixtures.push([players[i], players[i + 1]]);
    if (numOfLegs === 2) leg2Fixtures.push([players[i + 1], players[i]]);
  }
  return {
    leg1Fixtures,
    leg2Fixtures,
  };
};

const nextPowerOf2 = (n: number) => {
  return Math.pow(2, Math.ceil(Math.log2(n)));
};

const ensurePowerOf2 = (players: string[]) => {
  const nextPower = nextPowerOf2(players.length);
  while (players.length < nextPower) players.push(SYSTEM_PLAYER);
  return players;
};
