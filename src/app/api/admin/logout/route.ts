import { NextResponse } from "next/server";
import { clearAdminSession, isAdminAuthenticated } from "@/lib/auth";

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ success: true, message: "Berhasil logout." });
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}
