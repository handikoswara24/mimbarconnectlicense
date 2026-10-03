import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, addLog } from "@/lib/db";
import { setAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const admin = await verifyAdminCredentials(username, password);
    if (!admin) {
      await addLog({
        licenseKey: "SYSTEM",
        action: "admin_login",
        status: "rejected",
        details: `Percobaan login gagal untuk username "${username}"`
      });

      return NextResponse.json(
        { success: false, error: "Username atau password salah." },
        { status: 401 }
      );
    }

    await setAdminSession(admin);

    await addLog({
      licenseKey: "SYSTEM",
      action: "admin_login",
      status: "success",
      details: `Admin ${admin.name} (${admin.username}) berhasil login.`
    });

    return NextResponse.json({
      success: true,
      message: "Login admin berhasil.",
      user: {
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat login." },
      { status: 500 }
    );
  }
}
