import { prisma } from "@/lib/prisma";

export function serializeProduct(product: {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string } | number | string;
  imageUrl: string | null;
  category: string | null;
  isActive: boolean;
}) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    category: product.category,
    isActive: product.isActive,
  };
}

export async function getActiveProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return products.map(serializeProduct);
}

export async function getMenuForDay(dayOfWeek: number) {
  const items = await prisma.menuSchedule.findMany({
    where: { dayOfWeek, product: { isActive: true } },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

  return items.map((item) => ({
    id: item.id,
    dayOfWeek: item.dayOfWeek,
    product: serializeProduct(item.product),
  }));
}

export async function getWeeklyMenu() {
  const items = await prisma.menuSchedule.findMany({
    include: { product: true },
    orderBy: [{ dayOfWeek: "asc" }, { createdAt: "asc" }],
  });

  return items.map((item) => ({
    id: item.id,
    dayOfWeek: item.dayOfWeek,
    product: serializeProduct(item.product),
  }));
}
