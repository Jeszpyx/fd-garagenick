import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api/response";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { id } = await context.params;
    await prisma.menuSchedule.delete({ where: { id } });
    return apiSuccess({ success: true });
  } catch {
    return apiError("Не удалось удалить блюдо из меню", 500);
  }
}
