import fs from "fs";
import path from "path";
import crypto from "crypto";
import { DatabaseSchema, License, PricingSettings, ActivityLog, PlanType } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Helper to hash password
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Generate license key in format MBR-XXXX-XXXX-XXXX
export function generateLicenseKey(): string {
  const segment = () => crypto.randomBytes(2).toString("hex").toUpperCase();
  return `MBR-${segment()}-${segment()}-${segment()}`;
}

const DEFAULT_SETTINGS: PricingSettings = {
  monthlyPrice: 49000,
  monthlyOriginalPrice: 79000,
  yearlyPrice: 490000,
  yearlyOriginalPrice: 790000,
  currency: "IDR",
  promoBadgeText: "Hemat 2 Bulan",
  contactWhatsapp: "6281234567890",
  contactEmail: "support@mimbarconnect.com"
};

const DEFAULT_DB: DatabaseSchema = {
  adminPasswordHash: hashPassword("adminmimbar123"),
  pricing: DEFAULT_SETTINGS,
  licenses: [
    {
      id: "seed-license-1",
      key: "MBR-DEMO-2026-PRO1",
      plan: "yearly",
      status: "active",
      customerName: "Gereja / Masjid Mitra Contoh",
      customerEmail: "operator@mimbarcontoh.org",
      organization: "Gereja Bethany Pusat",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
      boundDeviceId: null,
      boundDeviceName: null,
      boundDeviceOs: null,
      activatedAt: null,
      lastValidatedAt: null,
      notes: "Lisensi demo awal untuk pengujian"
    },
    {
      id: "seed-license-2",
      key: "MBR-TEST-LOCK-PC99",
      plan: "monthly",
      status: "active",
      customerName: "Auditorium Graha Solusi",
      customerEmail: "soundman@grahasolusi.com",
      organization: "Graha Solusi Audio Visual",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      boundDeviceId: "PC-DESKTOP-STAGE-01",
      boundDeviceName: "OPERATOR-LAPTOP-MSI",
      boundDeviceOs: "Windows 11 Pro 64-bit",
      activatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastValidatedAt: new Date().toISOString(),
      notes: "Sedang terkunci di PC-DESKTOP-STAGE-01 untuk demo lock"
    }
  ],
  logs: [
    {
      id: "log-seed-1",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      licenseKey: "MBR-TEST-LOCK-PC99",
      action: "activate",
      status: "success",
      deviceId: "PC-DESKTOP-STAGE-01",
      deviceName: "OPERATOR-LAPTOP-MSI",
      details: "Aktivasi awal pada PC panggung"
    }
  ]
};

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
    return DEFAULT_DB;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.error("Failed to parse db.json, returning default db", error);
    return DEFAULT_DB;
  }
}

function writeDbFile(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
}

// ==================== LICENSES ====================
export function getLicenses(): License[] {
  const db = ensureDbFile();
  const now = new Date();
  
  // Auto-update expired status in memory / save if changed
  let changed = false;
  for (const lic of db.licenses) {
    if (lic.status === "active" && new Date(lic.expiresAt) < now) {
      lic.status = "expired";
      changed = true;
    }
  }
  if (changed) {
    writeDbFile(db);
  }

  return db.licenses;
}

export function getLicenseByKey(key: string): License | undefined {
  const cleanKey = key.trim().toUpperCase();
  const licenses = getLicenses();
  return licenses.find((l) => l.key.toUpperCase() === cleanKey);
}

export function createLicense(params: {
  plan: PlanType;
  customerName: string;
  customerEmail: string;
  organization?: string;
  durationMonths?: number;
  customKey?: string;
  notes?: string;
}): License {
  const db = ensureDbFile();
  const now = new Date();
  
  let duration = params.durationMonths;
  if (!duration) {
    if (params.plan === "monthly") duration = 1;
    else if (params.plan === "yearly") duration = 12;
    else if (params.plan === "lifetime") duration = 1200; // 100 years
    else duration = 1;
  }

  const expiresDate = new Date(now);
  expiresDate.setMonth(expiresDate.getMonth() + duration);

  const newLicense: License = {
    id: `lic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    key: params.customKey?.trim().toUpperCase() || generateLicenseKey(),
    plan: params.plan,
    status: "active",
    customerName: params.customerName.trim(),
    customerEmail: params.customerEmail.trim(),
    organization: params.organization?.trim() || "",
    createdAt: now.toISOString(),
    expiresAt: expiresDate.toISOString(),
    boundDeviceId: null,
    boundDeviceName: null,
    boundDeviceOs: null,
    activatedAt: null,
    lastValidatedAt: null,
    notes: params.notes || ""
  };

  db.licenses.unshift(newLicense);
  writeDbFile(db);

  addLog({
    licenseKey: newLicense.key,
    action: "create",
    status: "success",
    details: `Lisensi ${newLicense.plan} dibuat untuk ${newLicense.customerName}`
  });

  return newLicense;
}

export function updateLicense(key: string, updates: Partial<License>): License | null {
  const db = ensureDbFile();
  const index = db.licenses.findIndex((l) => l.key.toUpperCase() === key.trim().toUpperCase());
  if (index === -1) return null;

  db.licenses[index] = {
    ...db.licenses[index],
    ...updates
  };

  writeDbFile(db);
  return db.licenses[index];
}

export function deleteLicense(key: string): boolean {
  const db = ensureDbFile();
  const initialLength = db.licenses.length;
  db.licenses = db.licenses.filter((l) => l.key.toUpperCase() !== key.trim().toUpperCase());
  if (db.licenses.length !== initialLength) {
    writeDbFile(db);
    return true;
  }
  return false;
}

export function resetLicenseDevice(key: string): { success: boolean; message: string } {
  const db = ensureDbFile();
  const license = db.licenses.find((l) => l.key.toUpperCase() === key.trim().toUpperCase());
  if (!license) {
    return { success: false, message: "Lisensi tidak ditemukan." };
  }

  const previousDevice = license.boundDeviceName || license.boundDeviceId || "Tidak ada perangkat terikat";
  license.boundDeviceId = null;
  license.boundDeviceName = null;
  license.boundDeviceOs = null;
  license.activatedAt = null;

  writeDbFile(db);

  addLog({
    licenseKey: license.key,
    action: "force_disconnect",
    status: "success",
    details: `Perangkat di-reset oleh Admin (Sebelumnya: ${previousDevice})`
  });

  return { success: true, message: `Device lock berhasil dilepas dari ${previousDevice}.` };
}

// ==================== PRICING ====================
export function getPricingSettings(): PricingSettings {
  const db = ensureDbFile();
  return db.pricing || DEFAULT_SETTINGS;
}

export function updatePricingSettings(updates: Partial<PricingSettings>): PricingSettings {
  const db = ensureDbFile();
  db.pricing = {
    ...db.pricing,
    ...updates
  };
  writeDbFile(db);
  return db.pricing;
}

// ==================== LOGS ====================
export function getLogs(limit: number = 100): ActivityLog[] {
  const db = ensureDbFile();
  return (db.logs || []).slice(0, limit);
}

export function addLog(log: Omit<ActivityLog, "id" | "timestamp">): void {
  const db = ensureDbFile();
  if (!db.logs) db.logs = [];

  const newLog: ActivityLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...log
  };

  db.logs.unshift(newLog);
  // Keep last 500 logs
  if (db.logs.length > 500) {
    db.logs = db.logs.slice(0, 500);
  }

  writeDbFile(db);
}

// ==================== ADMIN AUTH ====================
export function verifyAdminPassword(password: string): boolean {
  const db = ensureDbFile();
  const hash = hashPassword(password);
  return db.adminPasswordHash === hash;
}

export function updateAdminPassword(newPassword: string): void {
  const db = ensureDbFile();
  db.adminPasswordHash = hashPassword(newPassword);
  writeDbFile(db);
}
