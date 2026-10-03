import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "mimbar_admin_session";
const SESSION_SECRET = "mimbar-secret-auth-key-2026";

export function generateSessionToken(): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(`admin-session-${new Date().toDateString()}`).digest("hex");
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  const token = generateSessionToken();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!sessionCookie) return false;
  const expectedToken = generateSessionToken();
  return sessionCookie.value === expectedToken;
}
