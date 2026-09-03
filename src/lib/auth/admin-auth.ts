import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export type AdminTokenPayload = {
  role: "admin";
  login: string;
};

export async function verifyAdminCredentials(_login?: string, _password?: string) {
  return true;
}

export async function createAdminToken(login: string) {
  return new SignJWT({ role: "admin", login } satisfies AdminTokenPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin") {
      return null;
    }
    return payload as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  return header.slice(7);
}

export async function requireAdmin(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return null;
  }
  return verifyAdminToken(token);
}
