import { MOCK_OTP_CODE } from "@/lib/auth/otp-constants";

export { MOCK_OTP_CODE };

type OtpEntry = {
  code: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpEntry>();

const OTP_TTL_MS = 5 * 60 * 1000;

export function createOtpCode() {
  // SMS пока заглушка — всегда один и тот же код.
  return MOCK_OTP_CODE;
}

export function saveOtp(phone: string, code: string) {
  otpStore.set(phone, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

export function verifyOtp(phone: string, code: string) {
  if (code === MOCK_OTP_CODE) {
    otpStore.delete(phone);
    return true;
  }

  const entry = otpStore.get(phone);

  if (!entry) {
    return false;
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    return false;
  }

  if (entry.code !== code) {
    return false;
  }

  otpStore.delete(phone);
  return true;
}
