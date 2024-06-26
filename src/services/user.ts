"use server";
import { PrismaClient } from "@prisma/client";
import kv from "../lib/redisClient";
import { unstable_noStore as noStore } from 'next/cache';

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

export const updateCache = async () => {
  const order = "desc";
  const cacheKey = `leaderboard`;

  const users = await prisma.user.findMany({
    include: {
      netWorth: true,
    },
    orderBy: {
      netWorth: {
        totalValue: order,
      },
    },
  });

  const importantData = users.map((user, index) => ({
    walletAddress: user.walletAddress,
    tokenValue: user.netWorth?.tokenValue,
    ethValue: user.netWorth?.ethereumValue,
    multiplier: user.multiplier,
    total: user.netWorth?.totalValue.toFixed(2),
    rank: index + 1,
  }));

  console.log("UpdateCacheData", importantData);
  await kv.set(cacheKey, importantData,  { ex: 1200 });
};

export async function fetchLeaderboardData() {
  const order = "desc";
  const cacheKey = "leaderboard";
  noStore()
  const cachedData = await kv.get(cacheKey);
  console.log("cachedData", cachedData);

  if (cachedData) {
    return cachedData;
  }

  const users = await prisma.user.findMany({
    include: {
      netWorth: true,
    },
    orderBy: {
      netWorth: {
        totalValue: order,
      },
    },
  });

  const importantData = users.map((user, index) => ({
    walletAddress: user.walletAddress,
    tokenValue: user.netWorth?.tokenValue,
    ethValue: user.netWorth?.ethereumValue,
    multiplier: user.multiplier,
    total: user.netWorth?.totalValue.toFixed(2),
    rank: index + 1,
  }));

  await kv.set(cacheKey, importantData, { ex: 1200 });
  return importantData;
}
