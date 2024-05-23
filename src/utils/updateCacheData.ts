import { PrismaClient } from "@prisma/client";
import redis from "../lib/redisClient";

const prisma = new PrismaClient();

const updateCache = async () => {
  const order = "desc";
  const cacheKey = `users:${order}`;

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

  await redis.set(cacheKey, JSON.stringify(importantData)); 
};

export default updateCache;
