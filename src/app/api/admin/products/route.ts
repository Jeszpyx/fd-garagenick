import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseProductForm, readUploadedImage } from "@/lib/product-image";

const productQuery = {
  omit: { imageData: true } as const,
  include: { category: { select: { id: true, name: true } } },
};

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const lite = request.nextUrl.searchParams.get("lite") === "1";

    if (lite) {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          isActive: true,
        },
        orderBy: [{ name: "asc" }],
      });

      return apiSuccess(
        products.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          isActive: product.isActive,
          description: null,
          calories: 0,
          proteins: 0,
          fats: 0,
          carbs: 0,
          grams: 0,
          imageUrl: null,
          categoryId: null,
          category: null,
        })),
      );
    }

    const products = await prisma.product.findMany({
      ...productQuery,
      orderBy: [{ createdAt: "desc" }],
    });

    return apiSuccess(products.map(serializeProduct));
  } catch {
    return apiError("Не удалось загрузить товары", 500);
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const formData = await request.formData();
    const { parsed, imageFile } = parseProductForm(formData);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid product", 400);
    }

    const categoryId = parsed.data.categoryId;
    const exists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!exists) {
      return apiError("Категория не найдена", 400);
    }

    const image = await readUploadedImage(imageFile);

    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        price: parsed.data.price,
        calories: parsed.data.calories,
        proteins: parsed.data.proteins,
        fats: parsed.data.fats,
        carbs: parsed.data.carbs,
        grams: parsed.data.grams,
        categoryId,
        isActive: parsed.data.isActive ?? true,
        imageData: image?.imageData,
        imageMimeType: image?.imageMimeType,
      },
      ...productQuery,
    });

    return apiSuccess(serializeProduct(product), 201);
  } catch (error) {
    if (error instanceof Error) {
      return apiError(error.message, 400);
    }
    return apiError("Не удалось создать товар", 500);
  }
}
