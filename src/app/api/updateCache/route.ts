import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import redis from "../../../lib/redisClient";

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

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");

  if (apiKey === process.env.UPDATE_CACHE_API_KEY) {
    try {
      await updateCache();
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error updating cache:", error);
      return NextResponse.json(
        { success: false, error: "Error updating cache" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
}
