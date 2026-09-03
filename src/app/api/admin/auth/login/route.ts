import { NextRequest } from "next/server";
import { requireAdmin, verifyAdminCredentials, createAdminToken } from "@/lib/auth/admin-auth";
import { apiError, apiSuccess } from "@/lib/api/response";
import { adminLoginSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid credentials", 400);
    }

    const isValid = await verifyAdminCredentials(
      parsed.data.login,
      parsed.data.password,
    );

    if (!isValid) {
      return apiError("Неверный логин или пароль", 401);
    }

    const token = await createAdminToken(parsed.data.login);

    return apiSuccess({
      token,
      login: parsed.data.login,
    });
  } catch {
    return apiError("Не удалось войти", 500);
  }
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  return apiSuccess({ login: admin.login, role: admin.role });
}
