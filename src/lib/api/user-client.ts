"use client";

/**
 * Проверяет / обновляет пользовательскую сессию.
 * Access живёт коротко, refresh — долго (без повторной SMS).
 */
export async function ensureUserSession(): Promise<boolean> {
  const me = await fetch("/api/auth/me", { credentials: "include" });
  if (me.ok) {
    return true;
  }

  const refreshed = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!refreshed.ok) {
    return false;
  }

  const again = await fetch("/api/auth/me", { credentials: "include" });
  return again.ok;
}

export async function logoutUser() {
  await fetch("/api/auth/me", {
    method: "DELETE",
    credentials: "include",
  });
}
