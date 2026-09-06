import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseProductForm, readUploadedImage } from "@/lib/product-image";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const productQuery = {
  omit: { imageData: true } as const,
  include: { category: { select: { id: true, name: true } } },
};

export async function PUT(request: NextRequest, context: RouteContext) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const { parsed, imageFile, removeImage } = parseProductForm(formData);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid product", 400);
    }

    const categoryId = parsed.data.categoryId;
    const exists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!exists) {
      return apiError("Категория не найдена", 400);
    }

    const image = await readUploadedImage(imageFile);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        price: parsed.data.price,
        calories: parsed.data.calories,
        proteins: parsed.data.proteins,
        fats: parsed.data.fats,
        carbs: parsed.data.carbs,
        categoryId,
        isActive: parsed.data.isActive ?? true,
        ...(image
          ? {
              imageData: image.imageData,
              imageMimeType: image.imageMimeType,
            }
          : removeImage
            ? { imageData: null, imageMimeType: null }
            : {}),
      },
      ...productQuery,
    });

    return apiSuccess(serializeProduct(product));
  } catch (error) {
    if (error instanceof Error) {
      return apiError(error.message, 400);
    }
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
