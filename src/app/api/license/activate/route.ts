import { NextRequest, NextResponse } from "next/server";
import { getLicenseByKey, updateLicense, addLog } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, deviceId, deviceName, osInfo } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { success: false, error: "Parameter 'key' (License Key) wajib diisi." },
        { status: 400 }
      );
    }

    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json(
        { success: false, error: "Parameter 'deviceId' (Hardware ID perangkat) wajib disertakan untuk penguncian 1 PC." },
        { status: 400 }
      );
    }

    const cleanKey = key.trim().toUpperCase();
    const license = await getLicenseByKey(cleanKey);

    if (!license) {
      await addLog({
        licenseKey: cleanKey,
        action: "activate",
        status: "rejected",
        deviceId,
        deviceName: deviceName || "Unknown",
        details: "Aktivasi gagal: License key tidak ditemukan"
      });
      return NextResponse.json(
        { success: false, error: "License key tidak valid atau tidak terdaftar di sistem." },
        { status: 404 }
      );
    }

    if (license.status === "revoked") {
      await addLog({
        licenseKey: cleanKey,
        action: "activate",
        status: "rejected",
        deviceId,
        deviceName: deviceName || "Unknown",
        details: "Aktivasi ditolak: Lisensi telah dibekukan/dicabut admin"
      });
      return NextResponse.json(
        { success: false, error: "Lisensi ini telah dinonaktifkan / dicabut oleh administrator." },
        { status: 403 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(license.expiresAt);
    if (expiresAt < now) {
      await addLog({
        licenseKey: cleanKey,
        action: "activate",
        status: "rejected",
        deviceId,
        deviceName: deviceName || "Unknown",
        details: `Aktivasi gagal: Masa aktif lisensi habis pada ${license.expiresAt}`
      });
      return NextResponse.json(
        {
          success: false,
          error: `Masa aktif lisensi telah kedaluwarsa pada ${expiresAt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}. Silakan perpanjang lisensi Anda.`
        },
        { status: 403 }
      );
    }

    // 1-PC Lock Verification:
    // If bound to a different PC, refuse activation until disconnected
    if (license.boundDeviceId && license.boundDeviceId !== deviceId) {
      const activeDeviceName = license.boundDeviceName || license.boundDeviceId;
      await addLog({
        licenseKey: cleanKey,
        action: "activate",
        status: "rejected",
        deviceId,
        deviceName: deviceName || "Unknown",
        details: `Ditolak: Terkunci di PC lain (${activeDeviceName})`
      });

      return NextResponse.json(
        {
          success: false,
          code: "DEVICE_LOCKED",
          error: `Lisensi ini sedang aktif dan terkunci di PC lain ("${activeDeviceName}"). Lisensi hanya dapat digunakan pada 1 PC. Harap lakukan Disconnect dari PC tersebut terlebih dahulu agar bisa digunakan di PC ini, atau hubungi admin.`,
          boundDevice: {
            deviceName: activeDeviceName,
            boundAt: license.activatedAt
          }
        },
        { status: 409 }
      );
    }

    // Activate or re-activate on this device
    const nowIso = now.toISOString();
    await updateLicense(cleanKey, {
      boundDeviceId: deviceId,
      boundDeviceName: deviceName || license.boundDeviceName || "Desktop PC",
      boundDeviceOs: osInfo || license.boundDeviceOs || "Windows",
      activatedAt: license.activatedAt || nowIso,
      lastValidatedAt: nowIso
    });

    await addLog({
      licenseKey: cleanKey,
      action: "activate",
      status: "success",
      deviceId,
      deviceName: deviceName || "Desktop PC",
      details: `Aktivasi berhasil pada perangkat ${deviceName || deviceId}`
    });

    return NextResponse.json({
      success: true,
      message: "Lisensi Mimbar Connect Pro berhasil diaktivasi pada perangkat ini.",
      license: {
        key: license.key,
        plan: license.plan,
        customerName: license.customerName,
        organization: license.organization,
        expiresAt: license.expiresAt,
        boundDeviceId: deviceId,
        boundDeviceName: deviceName || "Desktop PC",
        features: [
          "screen_share",
          "laser_pointer",
          "os_laser",
          "stage_keep_awake",
          "custom_alerts",
          "unlimited_mimbar_screens"
        ]
      }
    });
  } catch (error) {
    console.error("Error activating license:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal server saat aktivasi lisensi." },
      { status: 500 }
    );
  }
}
