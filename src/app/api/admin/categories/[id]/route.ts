import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api/response";
import { categorySchema } from "@/lib/validations";
import { serializeCategory } from "@/lib/services/catalog";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid category", 400);
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name: parsed.data.name },
    });

    return apiSuccess(serializeCategory(category));
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return apiError("Категория с таким названием уже есть", 409);
    }

    return apiError("Не удалось обновить категорию", 500);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { id } = await context.params;
    await prisma.category.delete({ where: { id } });
    return apiSuccess({ success: true });
  } catch {
    return apiError("Не удалось удалить категорию", 500);
  }
}
