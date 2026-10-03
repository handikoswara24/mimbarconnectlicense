import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { updateAdminUser, deleteAdminUser } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();

    const updated = await updateAdminUser(id, body);
    if (!updated) {
      return NextResponse.json({ error: "User admin tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Data user admin berhasil diperbarui."
    });
  } catch (error: any) {
    console.error("Error updating admin user:", error);
    return NextResponse.json({ error: error.message || "Gagal memperbarui admin." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteAdminUser(id);

    if (!deleted) {
      return NextResponse.json({ error: "User admin tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User admin berhasil dihapus."
    });
  } catch (error: any) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menghapus admin." },
      { status: 400 }
    );
  }
}
