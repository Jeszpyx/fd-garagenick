import { NextRequest } from "next/server";
import { createOtpCode, saveOtp } from "@/lib/auth/otp-store";
import { apiError, apiSuccess } from "@/lib/api/response";
import { normalizePhone } from "@/lib/utils";
import { phoneSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = phoneSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid phone", 400);
    }

    const phone = normalizePhone(parsed.data.phone);
    const code = createOtpCode();
    saveOtp(phone, code);

    if (process.env.NODE_ENV === "development") {
      console.log(`[OTP] ${phone}: ${code}`);
    }

    return apiSuccess({
      success: true,
      message: "Код отправлен",
      devCode: process.env.NODE_ENV === "development" ? code : undefined,
    });
  } catch {
    return apiError("Не удалось отправить код", 500);
  }
}
