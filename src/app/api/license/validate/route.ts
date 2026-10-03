import { NextRequest, NextResponse } from "next/server";
import { getLicenseByKey, updateLicense } from "@/lib/db";

async function handleValidate(key?: string, deviceId?: string) {
  if (!key || typeof key !== "string") {
    return NextResponse.json(
      { valid: false, reason: "MISSING_KEY", message: "Parameter 'key' wajib disertakan." },
      { status: 400 }
    );
  }

  const cleanKey = key.trim().toUpperCase();
  const license = getLicenseByKey(cleanKey);

  if (!license) {
    return NextResponse.json(
      { valid: false, reason: "NOT_FOUND", message: "License key tidak ditemukan di sistem." },
      { status: 404 }
    );
  }

  if (license.status === "revoked") {
    return NextResponse.json(
      { valid: false, reason: "REVOKED", message: "Lisensi telah dicabut atau dinonaktifkan oleh administrator." },
      { status: 403 }
    );
  }

  const now = new Date();
  const expiresAt = new Date(license.expiresAt);
  if (expiresAt < now) {
    return NextResponse.json(
      {
        valid: false,
        reason: "EXPIRED",
        message: `Masa aktif lisensi telah habis pada ${expiresAt.toLocaleDateString("id-ID")}.`,
        expiresAt: license.expiresAt
      },
      { status: 403 }
    );
  }

  // Device Lock check: If deviceId is provided, check if bound
  if (deviceId) {
    if (!license.boundDeviceId) {
      return NextResponse.json(
        {
          valid: false,
          reason: "NOT_ACTIVATED",
          message: "Lisensi ini belum diaktivasi pada perangkat ini. Silakan jalankan proses Aktivasi terlebih dahulu."
        },
        { status: 400 }
      );
    }

    if (license.boundDeviceId !== deviceId) {
      return NextResponse.json(
        {
          valid: false,
          reason: "DEVICE_MISMATCH",
          message: `Lisensi ini terikat pada PC lain (${license.boundDeviceName || license.boundDeviceId}). Harap putuskan dari PC tersebut terlebih dahulu.`,
          boundDeviceName: license.boundDeviceName
        },
        { status: 409 }
      );
    }

    // Update last validated timestamp
    updateLicense(cleanKey, {
      lastValidatedAt: now.toISOString()
    });
  }

  const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return NextResponse.json({
    valid: true,
    plan: license.plan,
    customerName: license.customerName,
    organization: license.organization,
    expiresAt: license.expiresAt,
    daysRemaining,
    boundDeviceId: license.boundDeviceId,
    boundDeviceName: license.boundDeviceName,
    features: [
      "screen_share",
      "laser_pointer",
      "os_laser",
      "stage_keep_awake",
      "custom_alerts",
      "unlimited_mimbar_screens"
    ]
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    return await handleValidate(body.key, body.deviceId);
  } catch (error) {
    console.error("Error validating license:", error);
    return NextResponse.json(
      { valid: false, reason: "SERVER_ERROR", message: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const key = searchParams.get("key") || undefined;
    const deviceId = searchParams.get("deviceId") || undefined;
    return await handleValidate(key, deviceId);
  } catch (error) {
    console.error("Error validating license via GET:", error);
    return NextResponse.json(
      { valid: false, reason: "SERVER_ERROR", message: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
