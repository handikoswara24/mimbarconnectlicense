/**
 * Mimbar Connect License Client Helper
 * 
 * Anda dapat menyalin file ini ke proyek desktop Anda:
 * D:\Handi\Playing Ground\mimbar-connect\src\lib\licenseClient.ts
 */

const LICENSE_SERVER_URL = process.env.NEXT_PUBLIC_LICENSE_SERVER_URL || "http://localhost:3000";

export interface LicenseValidationResponse {
  valid: boolean;
  reason?: "MISSING_KEY" | "NOT_FOUND" | "REVOKED" | "EXPIRED" | "NOT_ACTIVATED" | "DEVICE_MISMATCH" | "SERVER_ERROR";
  message?: string;
  plan?: "monthly" | "yearly" | "lifetime";
  customerName?: string;
  organization?: string;
  expiresAt?: string;
  daysRemaining?: number;
  boundDeviceId?: string;
  boundDeviceName?: string;
  features?: string[];
}

export interface LicenseActivationResponse {
  success: boolean;
  code?: string;
  message?: string;
  error?: string;
  license?: {
    key: string;
    plan: string;
    customerName: string;
    organization?: string;
    expiresAt: string;
    boundDeviceId: string;
    boundDeviceName: string;
    features: string[];
  };
  boundDevice?: {
    deviceName: string;
    boundAt: string;
  };
}

/**
 * 1. Aktivasi Kunci Lisensi pada Perangkat Ini (1 PC Device Lock)
 */
export async function activateLicense(
  key: string,
  deviceId: string,
  deviceName: string = "PC Operator",
  osInfo?: string
): Promise<LicenseActivationResponse> {
  const res = await fetch(`${LICENSE_SERVER_URL}/api/license/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: key.trim().toUpperCase(),
      deviceId,
      deviceName,
      osInfo: osInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Windows")
    })
  });
  return await res.json();
}

/**
 * 2. Putuskan Kunci Lisensi dari Perangkat Ini (Agar bisa dipakai di PC lain)
 */
export async function disconnectLicense(
  key: string,
  deviceId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await fetch(`${LICENSE_SERVER_URL}/api/license/disconnect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: key.trim().toUpperCase(),
      deviceId
    })
  });
  return await res.json();
}

/**
 * 3. Validasi Status Lisensi (Pemeriksaan berkala / startup aplikasi)
 */
export async function validateLicense(
  key: string,
  deviceId: string
): Promise<LicenseValidationResponse> {
  const res = await fetch(`${LICENSE_SERVER_URL}/api/license/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: key.trim().toUpperCase(),
      deviceId
    })
  });
  return await res.json();
}
