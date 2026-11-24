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

export async function ensureAdminSession(): Promise<string | null> {
  const response = await fetch("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const json = (await response.json()) as {
    data: { token?: string } | null;
    error: string | null;
  };

  if (!response.ok || !json.data?.token) {
    clearAdminToken();
    return null;
  }

  setAdminToken(json.data.token);
  return json.data.token;
}

export type AdminFetchResult<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

export async function adminFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<AdminFetchResult<T>> {
  const token = getAdminToken();

  const response = await fetch(path, {
    cache: "no-store",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let json: { data: T | null; error: string | null };
  try {
    json = (await response.json()) as { data: T | null; error: string | null };
  } catch {
    json = { data: null, error: "Не удалось разобрать ответ сервера" };
  }

  if (response.status === 401) {
    clearAdminToken();
  }

  return {
    data: json.data,
    error: json.error ?? (response.ok ? null : "Ошибка запроса"),
    status: response.status,
  };
}
