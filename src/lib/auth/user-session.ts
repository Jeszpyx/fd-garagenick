import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const ACCESS_COOKIE = "user_access";
const REFRESH_COOKIE = "user_refresh";
const LEGACY_COOKIE = "user_session";

const ACCESS_TTL = "15m";
const ACCESS_MAX_AGE = 60 * 15;
const REFRESH_TTL = "30d";
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

function getSecret() {
  const secret =
    process.env.JWT_SECRET || "dev-open-admin-secret-change-me-later";
  return new TextEncoder().encode(secret);
}

export type UserSession = {
  userId: string;
  phone: string;
};

type TokenKind = "access" | "refresh";

async function signToken(
  payload: UserSession,
  kind: TokenKind,
  expiresIn: string,
) {
  return new SignJWT({ ...payload, tokenUse: kind })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

async function verifyToken(
  token: string,
  kind: TokenKind,
): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.tokenUse !== kind) {
      return null;
    }
    if (
      typeof payload.userId !== "string" ||
      typeof payload.phone !== "string"
    ) {
      return null;
    }
    return {
      userId: payload.userId,
      phone: payload.phone,
    };
  } catch {
    return null;
  }
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

async function setSessionCookies(session: UserSession) {
  const [accessToken, refreshToken] = await Promise.all([
    signToken(session, "access", ACCESS_TTL),
    signToken(session, "refresh", REFRESH_TTL),
  ]);

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_MAX_AGE));
  cookieStore.set(REFRESH_COOKIE, refreshToken, cookieOptions(REFRESH_MAX_AGE));
  cookieStore.delete(LEGACY_COOKIE);
}

export async function createUserSession(payload: UserSession) {
  await setSessionCookies(payload);
}

export async function refreshUserSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return null;
  }

  const session = await verifyToken(refreshToken, "refresh");
  if (!session) {
    cookieStore.delete(ACCESS_COOKIE);
    cookieStore.delete(REFRESH_COOKIE);
    return null;
  }

  await setSessionCookies(session);
  return session;
}

export async function getUserSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (accessToken) {
    const accessSession = await verifyToken(accessToken, "access");
    if (accessSession) {
      return accessSession;
    }
  }

  // Старый однотокенный cookie — мигрируем на access/refresh.
  const legacyToken = cookieStore.get(LEGACY_COOKIE)?.value;
  if (legacyToken) {
    try {
      const { payload } = await jwtVerify(legacyToken, getSecret());
      if (
        typeof payload.userId === "string" &&
        typeof payload.phone === "string"
      ) {
        const session = {
          userId: payload.userId,
          phone: payload.phone,
        };
        await setSessionCookies(session);
        return session;
      }
    } catch {
      cookieStore.delete(LEGACY_COOKIE);
    }
  }

  return refreshUserSession();
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  cookieStore.delete(LEGACY_COOKIE);
}

export async function requireUserSession() {
  const session = await getUserSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
