export type PlanType = "monthly" | "yearly" | "lifetime" | "trial";
export type LicenseStatus = "active" | "revoked" | "expired";
export type AdminRole = "superadmin" | "admin";

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  lastLoginAt?: string;
}

export interface License {
  id: string;
  key: string; // Format: MBR-XXXX-XXXX-XXXX
  plan: PlanType;
  status: LicenseStatus;
  customerName: string;
  customerEmail: string;
  organization?: string;
  createdAt: string; // ISO string
  expiresAt: string; // ISO string
  boundDeviceId?: string | null; // Locked to 1 PC
  boundDeviceName?: string | null;
  boundDeviceOs?: string | null;
  activatedAt?: string | null;
  lastValidatedAt?: string | null;
  notes?: string;
}

export interface PricingSettings {
  monthlyPrice: number;
  monthlyOriginalPrice: number;
  yearlyPrice: number;
  yearlyOriginalPrice: number;
  currency: string;
  promoBadgeText: string;
  contactWhatsapp: string;
  contactEmail: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  licenseKey: string;
  action: "activate" | "disconnect" | "validate" | "force_disconnect" | "create" | "revoke" | "renew" | "admin_login";
  status: "success" | "rejected" | "error";
  deviceId?: string;
  deviceName?: string;
  ip?: string;
  details?: string;
}
