import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { serializeCategory } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { categorySchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return apiSuccess(categories.map(serializeCategory));
  } catch {
    return apiError("Не удалось загрузить категории", 500);
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid category", 400);
    }

    const category = await prisma.category.create({
      data: { name: parsed.data.name },
    });

    return apiSuccess(serializeCategory(category), 201);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return apiError("Категория с таким названием уже есть", 409);
    }

    return apiError("Не удалось создать категорию", 500);
  }
}
