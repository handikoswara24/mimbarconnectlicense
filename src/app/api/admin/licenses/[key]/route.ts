import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getLicenseByKey, updateLicense, deleteLicense, addLog } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await context.params;
  const license = getLicenseByKey(decodeURIComponent(key));
  if (!license) {
    return NextResponse.json({ error: "Lisensi tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ success: true, license });
}

export async function PATCH(
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
    const body = await req.json();

    const current = getLicenseByKey(cleanKey);
    if (!current) {
      return NextResponse.json({ error: "Lisensi tidak ditemukan" }, { status: 404 });
    }

    const updated = updateLicense(cleanKey, body);

    addLog({
      licenseKey: cleanKey,
      action: body.status === "revoked" ? "revoke" : "renew",
      status: "success",
      details: `Lisensi diubah oleh admin: ${JSON.stringify(body)}`
    });

    return NextResponse.json({
      success: true,
      message: "Lisensi berhasil diperbarui",
      license: updated
    });
  } catch (error) {
    console.error("Error updating license:", error);
    return NextResponse.json({ error: "Gagal memperbarui lisensi" }, { status: 500 });
  }
}

export async function DELETE(
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
    const success = deleteLicense(cleanKey);

    if (!success) {
      return NextResponse.json({ error: "Lisensi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Lisensi ${cleanKey} berhasil dihapus dari sistem.`
    });
  } catch (error) {
    console.error("Error deleting license:", error);
    return NextResponse.json({ error: "Gagal menghapus lisensi" }, { status: 500 });
  }
}
