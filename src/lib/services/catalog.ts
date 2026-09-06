import { prisma } from "@/lib/prisma";
import { dateKeyToUtcDate, dbDateToKey, todayDateKey } from "@/lib/utils";
import { productImageUrl } from "@/lib/product-image";

const productQuery = {
  omit: { imageData: true },
  include: { category: { select: { id: true, name: true } } },
} as const;

/** Лёгкий select для админ-календаря — только поля для списка. */
const productLiteSelect = {
  id: true,
  name: true,
  price: true,
  isActive: true,
} as const;

export function serializeProduct(product: {
  id: string;
  name: string;
  description?: string | null;
  price: { toString(): string } | number | string;
  calories?: number | null;
  proteins?: { toString(): string } | number | string | null;
  fats?: { toString(): string } | number | string | null;
  carbs?: { toString(): string } | number | string | null;
  imageMimeType?: string | null;
  categoryId?: string | null;
  category?: { id: string; name: string } | string | null;
  isActive: boolean;
  updatedAt?: Date;
}) {
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : (product.category?.name ?? null);

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? null,
    price: Number(product.price),
    calories: Number(product.calories ?? 0),
    proteins: Number(product.proteins ?? 0),
    fats: Number(product.fats ?? 0),
    carbs: Number(product.carbs ?? 0),
    imageUrl: product.imageMimeType
      ? productImageUrl(product.id, product.updatedAt)
      : null,
    categoryId:
      product.categoryId ??
      (typeof product.category === "object" ? product.category?.id : null) ??
      null,
    category: categoryName,
    isActive: product.isActive,
  };
}

export function serializeCategory(category: { id: string; name: string }) {
  return {
    id: category.id,
    name: category.name,
  };
}

export function serializeMenuItem(item: {
  id: string;
  date: Date;
  product: Parameters<typeof serializeProduct>[0];
}) {
  return {
    id: item.id,
    date: dbDateToKey(item.date),
    product: serializeProduct(item.product),
  };
}

export async function getActiveProducts() {
  const products = await prisma.product.findMany({
    ...productQuery,
    where: { isActive: true },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });

  return products.map(serializeProduct);
}

export async function getMenuForDate(dateKey: string) {
  const items = await prisma.menuSchedule.findMany({
    where: {
      date: dateKeyToUtcDate(dateKey),
      product: { isActive: true },
    },
    include: {
      product: productQuery,
    },
    orderBy: { createdAt: "asc" },
  });

  return items.map(serializeMenuItem);
}

export async function getMenuForToday() {
  return getMenuForDate(todayDateKey());
}

export async function getMenuInRange(
  fromDate: string,
  toDate: string,
  activeOnly = true,
  mode: "full" | "lite" = "full",
) {
  const items = await prisma.menuSchedule.findMany({
    where: {
      date: {
        gte: dateKeyToUtcDate(fromDate),
        lte: dateKeyToUtcDate(toDate),
      },
      ...(activeOnly ? { product: { isActive: true } } : {}),
    },
    include: {
      product: mode === "lite" ? { select: productLiteSelect } : productQuery,
    },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  return items.map(serializeMenuItem);
}
