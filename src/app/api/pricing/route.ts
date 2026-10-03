import { NextResponse } from "next/server";
import { getPricingSettings } from "@/lib/db";

export async function GET() {
  try {
    const pricing = await getPricingSettings();
    return NextResponse.json({
      success: true,
      pricing
    });
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data harga." },
      { status: 500 }
    );
  }
}
