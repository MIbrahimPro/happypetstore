import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SECRET || "happytails-dev-secret-change-me";
export const ADMIN_USER = process.env.ADMIN_USER || "admin";
export const ADMIN_PASS = process.env.ADMIN_PASS || "happytails247";

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function makeToken() {
  const payload = `${ADMIN_USER}.${Date.now()}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifyToken(token?: string) {
  if (!token) return false;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return false;
  try {
    const payload = Buffer.from(b64, "base64url").toString();
    const expected = sign(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAuthed() {
  const store = await cookies();
  return verifyToken(store.get("ht_session")?.value);
}

export const SESSION_COOKIE = "ht_session";
