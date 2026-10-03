import crypto from "crypto";
import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";
import { License, PricingSettings, ActivityLog, AdminUser, PlanType, AdminRole } from "./types";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

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

let isInitialized = false;

export async function ensureDbInitialized() {
  if (isInitialized) return;
  const db = await getDatabase();

  try {
    // 1. Ensure Admins index & seed superadmin
    const adminsCol = db.collection("admins");
    await adminsCol.createIndex({ username: 1 }, { unique: true });
    const adminCount = await adminsCol.countDocuments();
    if (adminCount === 0) {
      await adminsCol.insertOne({
        username: "admin",
        passwordHash: hashPassword("adminmimbar123"),
        name: "Super Administrator",
        email: "admin@mimbarconnect.com",
        role: "superadmin",
        createdAt: new Date().toISOString()
      });
    }

    // 2. Ensure Licenses index & seed initial licenses
    const licensesCol = db.collection("licenses");
    await licensesCol.createIndex({ key: 1 }, { unique: true });
    const licenseCount = await licensesCol.countDocuments();
    if (licenseCount === 0) {
      const now = new Date();
      await licensesCol.insertMany([
        {
          key: "MBR-DEMO-2026-PRO1",
          plan: "yearly",
          status: "active",
          customerName: "Gereja / Masjid Mitra Contoh",
          customerEmail: "operator@mimbarcontoh.org",
          organization: "Gereja Bethany Pusat",
          createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(now.getTime() + 335 * 24 * 60 * 60 * 1000).toISOString(),
          boundDeviceId: null,
          boundDeviceName: null,
          boundDeviceOs: null,
          activatedAt: null,
          lastValidatedAt: null,
          notes: "Lisensi demo awal untuk pengujian"
        },
        {
          key: "MBR-TEST-LOCK-PC99",
          plan: "monthly",
          status: "active",
          customerName: "Auditorium Graha Solusi",
          customerEmail: "soundman@grahasolusi.com",
          organization: "Graha Solusi Audio Visual",
          createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          boundDeviceId: "PC-DESKTOP-STAGE-01",
          boundDeviceName: "OPERATOR-LAPTOP-MSI",
          boundDeviceOs: "Windows 11 Pro 64-bit",
          activatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          lastValidatedAt: now.toISOString(),
          notes: "Sedang terkunci di PC-DESKTOP-STAGE-01 untuk demo lock"
        }
      ]);
    }

    // 3. Ensure Settings collection
    const settingsCol = db.collection("settings");
    const existingSettings = await settingsCol.findOne({ key: "pricing" });
    if (!existingSettings) {
      await settingsCol.insertOne({
        key: "pricing",
        ...DEFAULT_SETTINGS,
        updatedAt: new Date().toISOString()
      });
    }

    // 4. Ensure Logs index
    const logsCol = db.collection("logs");
    await logsCol.createIndex({ timestamp: -1 });

    isInitialized = true;
  } catch (err) {
    console.error("Error initializing MongoDB collections:", err);
  }
}

// ==================== ADMIN USER MANAGEMENT ====================

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<AdminUser | null> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const cleanUsername = username.trim().toLowerCase();
  const hash = hashPassword(password);

  const admin = await db.collection("admins").findOne({
    username: cleanUsername,
    passwordHash: hash
  });

  if (!admin) return null;

  // Update last login
  await db.collection("admins").updateOne(
    { _id: admin._id },
    { $set: { lastLoginAt: new Date().toISOString() } }
  );

  return {
    id: admin._id.toString(),
    username: admin.username,
    name: admin.name,
    email: admin.email,
    role: admin.role as AdminRole,
    createdAt: admin.createdAt,
    lastLoginAt: new Date().toISOString()
  };
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const admins = await db.collection("admins").find().sort({ createdAt: -1 }).toArray();

  return admins.map((a) => ({
    id: a._id.toString(),
    username: a.username,
    name: a.name,
    email: a.email,
    role: a.role as AdminRole,
    createdAt: a.createdAt,
    lastLoginAt: a.lastLoginAt
  }));
}

export async function createAdminUser(data: {
  username: string;
  password: string;
  name: string;
  email: string;
  role?: AdminRole;
}): Promise<AdminUser> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const cleanUsername = data.username.trim().toLowerCase();

  const existing = await db.collection("admins").findOne({ username: cleanUsername });
  if (existing) {
    throw new Error(`Username "${cleanUsername}" sudah digunakan.`);
  }

  const now = new Date().toISOString();
  const doc = {
    username: cleanUsername,
    passwordHash: hashPassword(data.password),
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    role: data.role || "admin",
    createdAt: now
  };

  const res = await db.collection("admins").insertOne(doc);

  await addLog({
    licenseKey: "SYSTEM",
    action: "create",
    status: "success",
    details: `User Admin baru dibuat: ${doc.username} (${doc.role})`
  });

  return {
    id: res.insertedId.toString(),
    username: doc.username,
    name: doc.name,
    email: doc.email,
    role: doc.role as AdminRole,
    createdAt: doc.createdAt
  };
}

export async function updateAdminUser(
  id: string,
  updates: {
    name?: string;
    email?: string;
    role?: AdminRole;
    password?: string;
  }
): Promise<boolean> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const setObj: any = { updatedAt: new Date().toISOString() };

  if (updates.name) setObj.name = updates.name.trim();
  if (updates.email) setObj.email = updates.email.trim().toLowerCase();
  if (updates.role) setObj.role = updates.role;
  if (updates.password && updates.password.trim()) {
    setObj.passwordHash = hashPassword(updates.password.trim());
  }

  const res = await db
    .collection("admins")
    .updateOne({ _id: new ObjectId(id) }, { $set: setObj });

  return res.matchedCount > 0;
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  await ensureDbInitialized();
  const db = await getDatabase();

  // Safety: Ensure at least one admin remains
  const count = await db.collection("admins").countDocuments();
  if (count <= 1) {
    throw new Error("Tidak dapat menghapus admin terakhir pada sistem.");
  }

  const res = await db.collection("admins").deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

// ==================== LICENSES MANAGEMENT ====================

export async function getLicenses(filter?: {
  search?: string;
  status?: string;
  plan?: string;
}): Promise<License[]> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const now = new Date();

  // Auto-update expired licenses
  await db.collection("licenses").updateMany(
    { status: "active", expiresAt: { $lt: now.toISOString() } },
    { $set: { status: "expired" } }
  );

  const query: any = {};

  if (filter?.status && filter.status !== "all") {
    query.status = filter.status;
  }

  if (filter?.plan && filter.plan !== "all") {
    query.plan = filter.plan;
  }

  if (filter?.search) {
    const s = filter.search;
    query.$or = [
      { key: { $regex: s, $options: "i" } },
      { customerName: { $regex: s, $options: "i" } },
      { customerEmail: { $regex: s, $options: "i" } },
      { organization: { $regex: s, $options: "i" } },
      { boundDeviceName: { $regex: s, $options: "i" } }
    ];
  }

  const docs = await db.collection("licenses").find(query).sort({ createdAt: -1 }).toArray();

  return docs.map((doc) => ({
    id: doc._id.toString(),
    key: doc.key,
    plan: doc.plan,
    status: doc.status,
    customerName: doc.customerName,
    customerEmail: doc.customerEmail,
    organization: doc.organization,
    createdAt: doc.createdAt,
    expiresAt: doc.expiresAt,
    boundDeviceId: doc.boundDeviceId || null,
    boundDeviceName: doc.boundDeviceName || null,
    boundDeviceOs: doc.boundDeviceOs || null,
    activatedAt: doc.activatedAt || null,
    lastValidatedAt: doc.lastValidatedAt || null,
    notes: doc.notes || ""
  }));
}

export async function getLicenseByKey(key: string): Promise<License | null> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const cleanKey = key.trim().toUpperCase();

  const doc = await db.collection("licenses").findOne({ key: cleanKey });
  if (!doc) return null;

  return {
    id: doc._id.toString(),
    key: doc.key,
    plan: doc.plan,
    status: doc.status,
    customerName: doc.customerName,
    customerEmail: doc.customerEmail,
    organization: doc.organization,
    createdAt: doc.createdAt,
    expiresAt: doc.expiresAt,
    boundDeviceId: doc.boundDeviceId || null,
    boundDeviceName: doc.boundDeviceName || null,
    boundDeviceOs: doc.boundDeviceOs || null,
    activatedAt: doc.activatedAt || null,
    lastValidatedAt: doc.lastValidatedAt || null,
    notes: doc.notes || ""
  };
}

export async function createLicense(params: {
  plan: PlanType;
  customerName: string;
  customerEmail: string;
  organization?: string;
  durationMonths?: number;
  customKey?: string;
  notes?: string;
}): Promise<License> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const now = new Date();

  let duration = params.durationMonths;
  if (!duration) {
    if (params.plan === "monthly") duration = 1;
    else if (params.plan === "yearly") duration = 12;
    else if (params.plan === "lifetime") duration = 1200;
    else duration = 1;
  }

  const expiresDate = new Date(now);
  expiresDate.setMonth(expiresDate.getMonth() + duration);

  const newLicense = {
    key: params.customKey?.trim().toUpperCase() || generateLicenseKey(),
    plan: params.plan,
    status: "active" as const,
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

  const res = await db.collection("licenses").insertOne(newLicense);

  await addLog({
    licenseKey: newLicense.key,
    action: "create",
    status: "success",
    details: `Lisensi ${newLicense.plan} dibuat untuk ${newLicense.customerName}`
  });

  return {
    id: res.insertedId.toString(),
    ...newLicense
  };
}

export async function updateLicense(
  key: string,
  updates: Partial<License>
): Promise<License | null> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const cleanKey = key.trim().toUpperCase();

  const { id, ...dataToUpdate } = updates as any;

  await db.collection("licenses").updateOne({ key: cleanKey }, { $set: dataToUpdate });

  return await getLicenseByKey(cleanKey);
}

export async function deleteLicense(key: string): Promise<boolean> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const cleanKey = key.trim().toUpperCase();

  const res = await db.collection("licenses").deleteOne({ key: cleanKey });
  return res.deletedCount > 0;
}

export async function resetLicenseDevice(key: string): Promise<{ success: boolean; message: string }> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const cleanKey = key.trim().toUpperCase();

  const license = await getLicenseByKey(cleanKey);
  if (!license) {
    return { success: false, message: "Lisensi tidak ditemukan." };
  }

  const previousDevice = license.boundDeviceName || license.boundDeviceId || "Tidak ada perangkat terikat";

  await db.collection("licenses").updateOne(
    { key: cleanKey },
    {
      $set: {
        boundDeviceId: null,
        boundDeviceName: null,
        boundDeviceOs: null,
        activatedAt: null
      }
    }
  );

  await addLog({
    licenseKey: cleanKey,
    action: "force_disconnect",
    status: "success",
    details: `Device lock di-reset oleh Admin (Sebelumnya: ${previousDevice})`
  });

  return { success: true, message: `Device lock berhasil dilepas dari ${previousDevice}.` };
}

// ==================== PRICING MANAGEMENT ====================

export async function getPricingSettings(): Promise<PricingSettings> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const doc = await db.collection("settings").findOne({ key: "pricing" });

  if (!doc) return DEFAULT_SETTINGS;

  return {
    monthlyPrice: doc.monthlyPrice ?? DEFAULT_SETTINGS.monthlyPrice,
    monthlyOriginalPrice: doc.monthlyOriginalPrice ?? DEFAULT_SETTINGS.monthlyOriginalPrice,
    yearlyPrice: doc.yearlyPrice ?? DEFAULT_SETTINGS.yearlyPrice,
    yearlyOriginalPrice: doc.yearlyOriginalPrice ?? DEFAULT_SETTINGS.yearlyOriginalPrice,
    currency: doc.currency || "IDR",
    promoBadgeText: doc.promoBadgeText || DEFAULT_SETTINGS.promoBadgeText,
    contactWhatsapp: doc.contactWhatsapp || DEFAULT_SETTINGS.contactWhatsapp,
    contactEmail: doc.contactEmail || DEFAULT_SETTINGS.contactEmail
  };
}

export async function updatePricingSettings(updates: Partial<PricingSettings>): Promise<PricingSettings> {
  await ensureDbInitialized();
  const db = await getDatabase();

  await db.collection("settings").updateOne(
    { key: "pricing" },
    {
      $set: {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    },
    { upsert: true }
  );

  return await getPricingSettings();
}

// ==================== ACTIVITY AUDIT LOGS ====================

export async function getLogs(limit: number = 100): Promise<ActivityLog[]> {
  await ensureDbInitialized();
  const db = await getDatabase();
  const docs = await db.collection("logs").find().sort({ timestamp: -1 }).limit(limit).toArray();

  return docs.map((d) => ({
    id: d._id.toString(),
    timestamp: d.timestamp,
    licenseKey: d.licenseKey,
    action: d.action,
    status: d.status,
    deviceId: d.deviceId,
    deviceName: d.deviceName,
    ip: d.ip,
    details: d.details
  }));
}

export async function addLog(log: Omit<ActivityLog, "id" | "timestamp">): Promise<void> {
  try {
    const db = await getDatabase();
    await db.collection("logs").insertOne({
      timestamp: new Date().toISOString(),
      ...log
    });
  } catch (err) {
    console.error("Failed to write activity log:", err);
  }
}
