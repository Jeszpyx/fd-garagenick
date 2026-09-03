import { prisma } from "@/lib/prisma";
import { dateKeyToUtcDate, dbDateToKey, todayDateKey } from "@/lib/utils";
import { productImageUrl } from "@/lib/product-image";

const productWithoutBlob = {
  omit: { imageData: true },
} as const;

export function serializeProduct(product: {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string } | number | string;
  imageMimeType?: string | null;
  category: string | null;
  isActive: boolean;
  updatedAt?: Date;
}) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    imageUrl: product.imageMimeType
      ? productImageUrl(product.id, product.updatedAt)
      : null,
    category: product.category,
    isActive: product.isActive,
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
    ...productWithoutBlob,
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
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
      product: productWithoutBlob,
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
      product: productWithoutBlob,
    },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  return items.map(serializeMenuItem);
}
