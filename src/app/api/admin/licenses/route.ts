import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getLicenses, createLicense } from "@/lib/db";
import { PlanType } from "@/lib/types";

export async function GET(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const licenses = getLicenses();
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search")?.toLowerCase();
  const status = searchParams.get("status");
  const plan = searchParams.get("plan");

  let filtered = licenses;

  if (search) {
    filtered = filtered.filter(
      (l) =>
        l.key.toLowerCase().includes(search) ||
        l.customerName.toLowerCase().includes(search) ||
        l.customerEmail.toLowerCase().includes(search) ||
        (l.organization && l.organization.toLowerCase().includes(search)) ||
        (l.boundDeviceName && l.boundDeviceName.toLowerCase().includes(search))
    );
  }

  if (status && status !== "all") {
    filtered = filtered.filter((l) => l.status === status);
  }

  if (plan && plan !== "all") {
    filtered = filtered.filter((l) => l.plan === plan);
  }

  // Calculate statistics
  const stats = {
    total: licenses.length,
    active: licenses.filter((l) => l.status === "active").length,
    boundCount: licenses.filter((l) => l.boundDeviceId).length,
    expiredCount: licenses.filter((l) => l.status === "expired").length,
    revokedCount: licenses.filter((l) => l.status === "revoked").length,
    monthlyCount: licenses.filter((l) => l.plan === "monthly").length,
    yearlyCount: licenses.filter((l) => l.plan === "yearly").length
  };

  return NextResponse.json({
    success: true,
    licenses: filtered,
    stats
  });
}

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { plan, customerName, customerEmail, organization, durationMonths, customKey, notes } = body;

    if (!customerName || !customerEmail || !plan) {
      return NextResponse.json(
        { error: "Nama pelanggan, email, dan paket wajib diisi." },
        { status: 400 }
      );
    }

    const license = createLicense({
      plan: plan as PlanType,
      customerName,
      customerEmail,
      organization,
      durationMonths: durationMonths ? parseInt(durationMonths) : undefined,
      customKey,
      notes
    });

    return NextResponse.json({
      success: true,
      message: "Lisensi berhasil dibuat.",
      license
    });
  } catch (error) {
    console.error("Error creating license by admin:", error);
    return NextResponse.json({ error: "Gagal membuat lisensi." }, { status: 500 });
  }
}
