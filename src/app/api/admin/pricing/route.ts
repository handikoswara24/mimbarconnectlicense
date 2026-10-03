import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPricingSettings, updatePricingSettings } from "@/lib/db";

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pricing = await getPricingSettings();
  return NextResponse.json({ success: true, pricing });
}

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updatePricingSettings({
      monthlyPrice: Number(body.monthlyPrice) || 0,
      monthlyOriginalPrice: Number(body.monthlyOriginalPrice) || 0,
      yearlyPrice: Number(body.yearlyPrice) || 0,
      yearlyOriginalPrice: Number(body.yearlyOriginalPrice) || 0,
      promoBadgeText: body.promoBadgeText || "",
      contactWhatsapp: body.contactWhatsapp || "",
      contactEmail: body.contactEmail || ""
    });

    return NextResponse.json({
      success: true,
      message: "Pengaturan harga berhasil diperbarui.",
      pricing: updated
    });
  } catch (error) {
    console.error("Error updating pricing:", error);
    return NextResponse.json({ error: "Gagal memperbarui harga" }, { status: 500 });
  }
}
