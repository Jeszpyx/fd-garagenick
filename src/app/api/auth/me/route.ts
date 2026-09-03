import { clearUserSession, getUserSession } from "@/lib/auth/user-session";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api/response";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return apiError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, phone: true, name: true },
  });

  if (!user) {
    return apiError("User not found", 404);
  }

  return apiSuccess(user);
}

export async function DELETE() {
  await clearUserSession();
  return apiSuccess({ success: true });
}
