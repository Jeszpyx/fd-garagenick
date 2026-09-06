import { MOCK_OTP_CODE } from "@/lib/auth/otp-constants";
import { createOtpCode, saveOtp } from "@/lib/auth/otp-store";
import { apiError, apiSuccess } from "@/lib/api/response";
import { normalizePhone } from "@/lib/utils";
import { phoneSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = phoneSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid phone", 400);
    }

    const phone = normalizePhone(parsed.data.phone);
    const code = createOtpCode();
    saveOtp(phone, code);

    console.log(`[OTP mock] ${phone}: ${code}`);

    return apiSuccess({
      success: true,
      message: "Код отправлен (заглушка SMS)",
      // Пока SMS не подключены — всегда отдаём код клиенту.
      mockCode: MOCK_OTP_CODE,
    });
  } catch {
    return apiError("Не удалось отправить код", 500);
  }
}
