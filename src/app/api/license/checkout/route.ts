import { NextRequest, NextResponse } from "next/server";
import { createLicense, getPricingSettings } from "@/lib/db";
import { PlanType } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, customerName, customerEmail, organization, paymentMethod } = body;

    if (!plan || (plan !== "monthly" && plan !== "yearly")) {
      return NextResponse.json(
        { success: false, error: "Pilihan paket tidak valid (harus monthly atau yearly)." },
        { status: 400 }
      );
    }

    if (!customerName || typeof customerName !== "string" || customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Nama lengkap wajib diisi." },
        { status: 400 }
      );
    }

    if (!customerEmail || typeof customerEmail !== "string" || !customerEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Alamat email tidak valid." },
        { status: 400 }
      );
    }

    const pricing = getPricingSettings();
    const durationMonths = plan === "yearly" ? 12 : 1;
    const price = plan === "yearly" ? pricing.yearlyPrice : pricing.monthlyPrice;

    // Create license
    const newLicense = createLicense({
      plan: plan as PlanType,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      organization: organization?.trim() || "Pribadi / Umum",
      durationMonths,
      notes: `Order via Website Checkout (${paymentMethod || "Instant Mock Payment"} - Rp ${price.toLocaleString("id-ID")})`
    });

    return NextResponse.json({
      success: true,
      message: "Pembelian lisensi berhasil diselesaikan!",
      order: {
        orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
        licenseKey: newLicense.key,
        plan: newLicense.plan,
        customerName: newLicense.customerName,
        customerEmail: newLicense.customerEmail,
        organization: newLicense.organization,
        amountPaid: price,
        expiresAt: newLicense.expiresAt,
        instruction: "Buka aplikasi Mimbar Connect di PC Operator Anda, masuk ke Pengaturan Lisensi, lalu tempel (paste) License Key di atas untuk mengaktifkan seluruh fitur Pro."
      }
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal server saat memproses pembelian." },
      { status: 500 }
    );
  }
}
