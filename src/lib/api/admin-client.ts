"use client";

const ADMIN_TOKEN_KEY = "admin_token";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function adminFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ data: T | null; error: string | null }> {
  const token = getAdminToken();

  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = (await response.json()) as { data: T | null; error: string | null };
  return json;
}
