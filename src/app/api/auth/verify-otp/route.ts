import { NextRequest } from "next/server";
import { verifyOtp } from "@/lib/auth/otp-store";
import { createUserSession } from "@/lib/auth/user-session";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api/response";
import { normalizePhone } from "@/lib/utils";
import { verifyOtpSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid payload", 400);
    }

    const phone = normalizePhone(parsed.data.phone);

    if (!verifyOtp(phone, parsed.data.code)) {
      return apiError("Неверный или просроченный код", 401);
    }

    const user = await prisma.user.upsert({
      where: { phone },
      update: parsed.data.name ? { name: parsed.data.name } : {},
      create: {
        phone,
        name: parsed.data.name,
      },
    });

    await createUserSession({ userId: user.id, phone: user.phone });

    return apiSuccess({
      id: user.id,
      phone: user.phone,
      name: user.name,
    });
  } catch {
    return apiError("Не удалось войти", 500);
  }
}
