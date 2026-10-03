import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getLogs } from "@/lib/db";

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs = await getLogs(200);
  return NextResponse.json({ success: true, logs });
}
