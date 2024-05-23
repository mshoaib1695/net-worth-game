import { NextRequest, NextResponse } from "next/server";
import fetchNetWorth from "../../../lib/netWorth";
import verifyToken from "../../../utils/verifyJWT";
import { createUser, getUser, updateUser } from "../../../services/user";

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization?.split(" ")[1]) {
      return NextResponse.json(
        { error: "Failed to authenticate" },
        { status: 500 }
      );
    }
    const token = authorization?.split(" ")[1];
    const decoded = await verifyToken(token);
    const walletAddress = decoded?.verified_credentials[0].address;

    const user = await getUser(walletAddress);
    const data = await fetchNetWorth(walletAddress);
    if (user) {
      await updateUser(
        {
          walletAddress: walletAddress,
          multiplier: user.multiplier + 1,
          id: user.id,
        },
        data
      );
      const response = NextResponse.json({ success: true });
      return response;
    } else {
      const newUser = await createUser(walletAddress, data);
      const response = NextResponse.json({ success: true, user: newUser });
      return response;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
