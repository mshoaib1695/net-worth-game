import { NextRequest, NextResponse } from "next/server";
import { updateCache } from "../../../services/user";

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
