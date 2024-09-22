import { prisma } from '../db';

export const createPlayer = async (name: string) => {
  return prisma.player.create({
    data: {
      name,
    },
  });
};

export const getPlayers = async () => {
  return prisma.player.findMany();
};

export const activatePlayer = async (playerId: number, activate: boolean) => {
  return prisma.player.update({
    where: {
      id: playerId,
    },
    data: {
      isActive: !!activate,
    },
  });
};
