import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { resetLicenseDevice } from "@/lib/db";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key } = await context.params;
    const cleanKey = decodeURIComponent(key);

    const result = await resetLicenseDevice(cleanKey);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error("Error resetting license device:", error);
    return NextResponse.json(
      { error: "Gagal mereset perangkat lisensi." },
      { status: 500 }
    );
  }
}
