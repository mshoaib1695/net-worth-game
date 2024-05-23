import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUser(walletAddress: string) {
  return await prisma.user.findUnique({
    where: { walletAddress },
    include: { netWorth: true },
  });
}

export async function updateUser(
  user: { multiplier: number; walletAddress: string; id: number },
  data: { ethValue: number; tokenValue: number; netWorth: number }
) {
  const now = new Date();

  await prisma.user.update({
    where: { walletAddress: user.walletAddress },
    data: {
      multiplier: user.multiplier,
      lastSignIn: now,
    },
  });

  await prisma.netWorth.update({
    where: { userId: user.id },
    data: {
      ethereumValue: data.ethValue,
      tokenValue: data.tokenValue,
      totalValue: data.netWorth * user.multiplier,
    },
  });
}

export async function createUser(
  walletAddress: string,
  data: { ethValue: number; tokenValue: number; netWorth: number }
) {
  const now = new Date();

  const newUser = await prisma.user.create({
    data: {
      walletAddress,
      multiplier: 1,
      lastSignIn: now,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.netWorth.create({
    data: {
      userId: newUser.id,
      ethereumValue: data.ethValue,
      tokenValue: data.tokenValue,
      totalValue: data.netWorth * 1,
    },
  });

  return newUser;
}
