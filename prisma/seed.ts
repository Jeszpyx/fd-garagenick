import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const categoryNames = [
  "Супы",
  "Салаты",
  "Горячее",
  "Суши",
  "Десерты",
  "Напитки",
] as const;

const products = [
  {
    name: "Борщ домашний",
    description: "Классический борщ со сметаной и чесночными пампушками",
    price: 9.5,
    calories: 280,
    proteins: 12.5,
    fats: 9.0,
    carbs: 32.0,
    category: "Супы",
    imageUrl:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
  },
  {
    name: "Суп-пюре из тыквы",
    description: "Нежный крем-суп с тыквенными семечками",
    price: 8.9,
    calories: 220,
    proteins: 6.0,
    fats: 10.0,
    carbs: 28.0,
    category: "Супы",
    imageUrl:
      "https://images.unsplash.com/photo-1476718406336-bb3a9690ee2a?w=800&q=80",
  },
  {
    name: "Цезарь с курицей",
    description: "Хрустящий салат с пармезаном и соусом цезарь",
    price: 14.5,
    calories: 420,
    proteins: 28.0,
    fats: 24.0,
    carbs: 18.0,
    category: "Салаты",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  },
  {
    name: "Греческий салат",
    description: "Свежие овощи, фета и оливки",
    price: 12.9,
    calories: 310,
    proteins: 10.0,
    fats: 22.0,
    carbs: 14.0,
    category: "Салаты",
    imageUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
  },
  {
    name: "Паста карбонара",
    description: "Спагетти с беконом и сливочным соусом",
    price: 16.5,
    calories: 650,
    proteins: 24.0,
    fats: 28.0,
    carbs: 72.0,
    category: "Горячее",
    imageUrl:
      "https://images.unsplash.com/photo-1612874741227-4c2d2a6f4f6d?w=800&q=80",
  },
  {
    name: "Стейк из лосося",
    description: "Лосось на гриле с овощами",
    price: 24.9,
    calories: 480,
    proteins: 42.0,
    fats: 28.0,
    carbs: 8.0,
    category: "Горячее",
    imageUrl:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
  },
  {
    name: "Бургер классик",
    description: "Говяжья котлета, сыр чеддер, соус бургер",
    price: 15.9,
    calories: 720,
    proteins: 34.0,
    fats: 38.0,
    carbs: 52.0,
    category: "Горячее",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  },
  {
    name: "Ролл Филадельфия",
    description: "Лосось, сливочный сыр, огурец",
    price: 18.5,
    calories: 390,
    proteins: 18.0,
    fats: 16.0,
    carbs: 42.0,
    category: "Суши",
    imageUrl:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
  },
  {
    name: "Сет Токио",
    description: "8 роллов: калифорния, унаги, спайси тунец",
    price: 34.9,
    calories: 980,
    proteins: 42.0,
    fats: 36.0,
    carbs: 110.0,
    category: "Суши",
    imageUrl:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
  },
  {
    name: "Тирамisu",
    description: "Итальянский десерт с mascarpone",
    price: 9.9,
    calories: 360,
    proteins: 6.5,
    fats: 20.0,
    carbs: 38.0,
    category: "Десерты",
    imageUrl:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
  },
  {
    name: "Чизкейк Нью-Йорк",
    description: "Классический чизкейк с ягодным соусом",
    price: 10.5,
    calories: 410,
    proteins: 7.0,
    fats: 26.0,
    carbs: 40.0,
    category: "Десерты",
    imageUrl:
      "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&q=80",
  },
  {
    name: "Смузи манго",
    description: "Освежающий фруктовый смузи",
    price: 7.5,
    calories: 180,
    proteins: 2.0,
    fats: 1.0,
    carbs: 42.0,
    category: "Напитки",
    imageUrl:
      "https://images.unsplash.com/photo-1505252585467-1267626329ed?w=800&q=80",
  },
  {
    name: "Латте",
    description: "Кофе с молоком и молочной пеной",
    price: 6.5,
    calories: 150,
    proteins: 8.0,
    fats: 6.0,
    carbs: 14.0,
    category: "Напитки",
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
  },
  {
    name: "Пицца Маргарита",
    description: "Томатный соус, моцарелла, базилик",
    price: 19.9,
    calories: 780,
    proteins: 28.0,
    fats: 26.0,
    carbs: 98.0,
    category: "Горячее",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  },
  {
    name: "Шашлык из свинины",
    description: "Маринованная свинина с овощами на гриле",
    price: 21.5,
    calories: 540,
    proteins: 38.0,
    fats: 36.0,
    carbs: 6.0,
    category: "Горячее",
    imageUrl:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
  },
];

async function downloadImage(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const mime = response.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
    const imageData = Buffer.from(await response.arrayBuffer());

    return { imageData, imageMimeType: mime };
  } catch {
    return null;
  }
}

async function main() {
  const existingProducts = await prisma.product.count();
  const existingCategories = await prisma.category.count();
  const force =
    process.env.FORCE_SEED === "1" || process.argv.includes("--force");

  if (!force && (existingProducts > 0 || existingCategories > 0)) {
    console.log(
      `Seed skipped: DB already has data (products=${existingProducts}, categories=${existingCategories}). Run with --force or FORCE_SEED=1 to reseed.`,
    );
    return;
  }

  if (force) {
    console.log("FORCE_SEED=1: clearing existing data before seed…");
  }

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuSchedule.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categoryMap = new Map<string, string>();
  for (const name of categoryNames) {
    const category = await prisma.category.create({ data: { name } });
    categoryMap.set(name, category.id);
  }

  const createdProducts: Array<{ id: string }> = [];

  for (const product of products) {
    const image = await downloadImage(product.imageUrl);
    createdProducts.push(
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          calories: product.calories,
          proteins: product.proteins,
          fats: product.fats,
          carbs: product.carbs,
          categoryId: categoryMap.get(product.category)!,
          imageData: image?.imageData,
          imageMimeType: image?.imageMimeType,
        },
      }),
    );
  }

  const menuByDay = [
    [0, 1, 4],
    [2, 3, 6],
    [0, 5, 7],
    [1, 8, 9],
    [4, 10, 11],
    [6, 12, 13],
    [5, 14, 9],
  ];

  const today = new Date();

  for (let offset = 0; offset < 14; offset += 1) {
    const local = new Date(today);
    local.setDate(today.getDate() + offset);
    const date = new Date(
      Date.UTC(local.getFullYear(), local.getMonth(), local.getDate()),
    );
    const variant = menuByDay[offset % menuByDay.length];

    for (const productIndex of variant) {
      const product = createdProducts[productIndex];
      if (!product) continue;

      await prisma.menuSchedule.create({
        data: {
          productId: product.id,
          date,
        },
      });
    }
  }

  await prisma.user.create({
    data: {
      phone: "+375291234567",
      name: "Тестовый пользователь",
    },
  });

  console.log(
    `Seeded ${categoryNames.length} categories, ${createdProducts.length} products (BYN) and 14 days of menu.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
