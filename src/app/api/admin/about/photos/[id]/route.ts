import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api/response";
import {
  getOrCreateAboutInfo,
  serializeAboutInfo,
} from "@/lib/services/about";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  const { id } = await context.params;

  try {
    const photo = await prisma.aboutPhoto.findFirst({
      where: { id, aboutId: 1 },
      select: { id: true },
    });

    if (!photo) {
      return apiError("Фото не найдено", 404);
    }

    await prisma.aboutPhoto.delete({ where: { id } });
    const about = await getOrCreateAboutInfo();
    return apiSuccess(serializeAboutInfo(about));
  } catch {
    return apiError("Не удалось удалить фото", 500);
  }
}
