import { NextRequest, NextResponse } from "next/server";
import { getLicenseByKey, updateLicense, addLog } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, deviceId } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { success: false, error: "Parameter 'key' (License Key) wajib diisi." },
        { status: 400 }
      );
    }

    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json(
        { success: false, error: "Parameter 'deviceId' wajib disertakan untuk verifikasi pelepasan lisensi." },
        { status: 400 }
      );
    }

    const cleanKey = key.trim().toUpperCase();
    const license = await getLicenseByKey(cleanKey);

    if (!license) {
      return NextResponse.json(
        { success: false, error: "License key tidak ditemukan di sistem." },
        { status: 404 }
      );
    }

    // Check if key is currently bound
    if (!license.boundDeviceId) {
      return NextResponse.json({
        success: true,
        message: "Lisensi ini memang sedang tidak terikat pada perangkat manapun. Siap digunakan di PC baru."
      });
    }

    // Verify device ownership: only the bound device (or admin) can disconnect
    if (license.boundDeviceId !== deviceId) {
      await addLog({
        licenseKey: cleanKey,
        action: "disconnect",
        status: "rejected",
        deviceId,
        details: `Gagal disconnect: Perangkat ${deviceId} mencoba melepas key yang terkunci di ${license.boundDeviceId}`
      });

      return NextResponse.json(
        {
          success: false,
          error: `Gagal memutuskan lisensi. Lisensi ini sedang terikat pada PC lain ("${license.boundDeviceName || license.boundDeviceId}"). Anda hanya bisa memutuskan dari PC tersebut, atau meminta Admin mereset lisensi melalui dashboard.`
        },
        { status: 403 }
      );
    }

    const previousDeviceName = license.boundDeviceName || license.boundDeviceId;

    // Disconnect: release device lock
    await updateLicense(cleanKey, {
      boundDeviceId: null,
      boundDeviceName: null,
      boundDeviceOs: null,
      activatedAt: null
    });

    await addLog({
      licenseKey: cleanKey,
      action: "disconnect",
      status: "success",
      deviceId,
      deviceName: previousDeviceName,
      details: `Lisensi berhasil dilepas dari perangkat ${previousDeviceName}. Sekarang tersedia untuk PC baru.`
    });

    return NextResponse.json({
      success: true,
      message: `Lisensi berhasil dilepas dari perangkat "${previousDeviceName}". Lisensi Anda kini bebas dan dapat digunakan pada PC baru.`,
      key: license.key
    });
  } catch (error) {
    console.error("Error disconnecting license:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal server saat melepaskan lisensi." },
      { status: 500 }
    );
  }
}
