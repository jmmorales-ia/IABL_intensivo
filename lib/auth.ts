// Firma de la cookie de sesión de admin con HMAC-SHA256 via Web Crypto,
// para que funcione tanto en middleware (edge runtime) como en server actions (node).

export const ADMIN_COOKIE_NAME = "iabl_admin_session";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

const encoder = new TextEncoder();

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD no está configurada en las variables de entorno.");
  }
  return secret;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const payload = `admin.${Date.now()}`;
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toHex(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;

  const payload = token.slice(0, lastDot);
  const signatureHex = token.slice(lastDot + 1);

  const parts = payload.split(".");
  if (parts.length !== 2 || parts[0] !== "admin") return false;
  const timestamp = Number(parts[1]);
  if (!Number.isFinite(timestamp)) return false;
  if (Date.now() - timestamp > MAX_AGE_MS) return false;

  const key = await getKey();
  const expectedSignature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expectedHex = toHex(expectedSignature);

  if (expectedHex.length !== signatureHex.length) return false;
  let diff = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    diff |= expectedHex.charCodeAt(i) ^ signatureHex.charCodeAt(i);
  }
  return diff === 0;
}

export const ADMIN_COOKIE_MAX_AGE_SECONDS = MAX_AGE_MS / 1000;
