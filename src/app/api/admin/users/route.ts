import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAdminUsers, createAdminUser } from "@/lib/db";
import { AdminRole } from "@/lib/types";

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await getAdminUsers();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json({ error: "Gagal mengambil data user admin." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { username, password, name, email, role } = body;

    if (!username || !password || !name || !email) {
      return NextResponse.json(
        { error: "Username, password, nama, dan email wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const newUser = await createAdminUser({
      username,
      password,
      name,
      email,
      role: (role as AdminRole) || "admin"
    });

    return NextResponse.json({
      success: true,
      message: `User admin "${newUser.username}" berhasil dibuat.`,
      user: newUser
    });
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: error.message || "Gagal membuat user admin baru." },
      { status: 400 }
    );
  }
}
