import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { productSchema } from "@/lib/validations";

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
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid product", 400);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        price: parsed.data.price,
        imageUrl: parsed.data.imageUrl ?? null,
        category: parsed.data.category ?? null,
        isActive: parsed.data.isActive ?? true,
      },
    });

    return apiSuccess(serializeProduct(product));
  } catch {
    return apiError("Не удалось обновить товар", 500);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { id } = await context.params;
    await prisma.product.delete({ where: { id } });
    return apiSuccess({ success: true });
  } catch {
    return apiError("Не удалось удалить товар", 500);
  }
}
