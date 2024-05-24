import { NextRequest, NextResponse } from "next/server";
import verifyToken from "../../../utils/verifyJWT";
import { fetchLeaderboardData } from "../../../services/user";

export async function GET(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  if (!authorization?.split(" ")[1]) {
    const response = NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
  try {
    const token = authorization?.split(" ")[1];
    await verifyToken(token);
    const leaderboardData = await fetchLeaderboardData();
    console.log("leaderboardData: ", leaderboardData)
    const response = NextResponse.json({ success: true, data: leaderboardData });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error(error);
    const response = NextResponse.json({ error }, { status: 500 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
