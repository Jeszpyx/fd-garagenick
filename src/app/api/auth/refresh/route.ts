import { refreshUserSession } from "@/lib/auth/user-session";
import { apiError, apiSuccess } from "@/lib/api/response";

export async function POST() {
  const session = await refreshUserSession();
  if (!session) {
    return apiError("Unauthorized", 401);
  }

  return apiSuccess({
    userId: session.userId,
    phone: session.phone,
  });
}
