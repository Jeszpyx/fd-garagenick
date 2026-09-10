import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const rangesByCategory: Record<string, [number, number]> = {
  Супы: [250, 400],
  Салаты: [180, 320],
  Горячее: [280, 450],
  Суши: [200, 360],
  Десерты: [90, 200],
  Напитки: [200, 400],
};

function randomGrams(min: number, max: number) {
  const value = min + Math.random() * (max - min);
  return Math.round(value / 10) * 10;
}

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      grams: true,
      category: { select: { name: true } },
    },
  });

  for (const product of products) {
    const [min, max] =
      rangesByCategory[product.category?.name ?? ""] ?? [200, 350];
    const grams = randomGrams(min, max);

    await prisma.product.update({
      where: { id: product.id },
      data: { grams },
    });

    console.log(`${product.name}: ${product.grams} → ${grams} г`);
  }

  console.log(`Updated ${products.length} products with random grams.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
