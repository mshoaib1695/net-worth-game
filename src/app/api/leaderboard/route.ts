import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import redis from "@/lib/redisClient";
import verifyToken from "@/utils/verifyJWT";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  if (!authorization?.split(" ")[1]) {
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
  try {
    const token = authorization?.split(" ")[1];
    const cacheKey = `leaderboard`;
    await verifyToken(token);
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json({ success: true, data: cachedData });
    }

    const users = await prisma.user.findMany({
      include: {
        netWorth: true,
      },
      orderBy: {
        netWorth: {
          totalValue: "desc",
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
    return NextResponse.json({ success: true, data: importantData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
