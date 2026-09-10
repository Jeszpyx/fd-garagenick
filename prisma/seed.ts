import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

function readArgValue(flag: string): string | undefined {
  const withEquals = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (withEquals) {
    return withEquals.slice(flag.length + 1);
  }

  const index = process.argv.indexOf(flag);
  if (index >= 0 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }

  return undefined;
}

function getDatabaseUrl() {
  const fromArg = readArgValue("--url");
  if (fromArg) {
    return fromArg;
  }

  if (process.env.SEED_DATABASE_URL) {
    return process.env.SEED_DATABASE_URL;
  }

  // Тестовая Prisma Postgres — дефолт для локального сида
  return "postgres://08b47e0c7b4d45a730f9e927761e01eb75ea39c215f192ae8cf140cc8f84a69b:sk_uOLimeLICbrNumSX4BK8M@pooled.db.prisma.io:5432/postgres?sslmode=require";
}

const databaseUrl = getDatabaseUrl();
const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const categoryNames = [
  "Супы",
  "Салаты",
  "Горячее",
  "Суши",
  "Десерты",
  "Напитки",
] as const;

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  category: (typeof categoryNames)[number];
  imageUrl: string;
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const gramsRangeByCategory: Record<(typeof categoryNames)[number], [number, number]> = {
  Супы: [250, 400],
  Салаты: [180, 320],
  Горячее: [280, 450],
  Суши: [200, 360],
  Десерты: [90, 200],
  Напитки: [200, 400],
};

function randomGrams(category: (typeof categoryNames)[number]) {
  const [min, max] = gramsRangeByCategory[category];
  return Math.round((min + Math.random() * (max - min)) / 10) * 10;
}

const products: SeedProduct[] = [
  // Супы (8)
  {
    name: "Борщ домашний",
    description: "Классический борщ со сметаной и чесночными пампушками",
    price: 9.5,
    calories: 280,
    proteins: 12.5,
    fats: 9.0,
    carbs: 32.0,
    category: "Супы",
    imageUrl: img("photo-1547592166-23ac45744acd"),
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
    imageUrl: img("photo-1482049016688-2d3e1b311543"),
  },
  {
    name: "Томатный суп",
    description: "Густой томатный суп с базиликом и гренками",
    price: 8.5,
    calories: 190,
    proteins: 5.0,
    fats: 7.0,
    carbs: 26.0,
    category: "Супы",
    imageUrl: img("photo-1540420773420-3366772f4999"),
  },
  {
    name: "Куриный бульон с лапшой",
    description: "Лёгкий бульон, домашняя лапша, зелень",
    price: 7.9,
    calories: 210,
    proteins: 14.0,
    fats: 6.0,
    carbs: 22.0,
    category: "Супы",
    imageUrl: img("photo-1585032226651-759b368d7246"),
  },
  {
    name: "Грибной крем-суп",
    description: "Шампиньоны, сливки, трюфельное масло",
    price: 9.9,
    calories: 260,
    proteins: 8.0,
    fats: 16.0,
    carbs: 18.0,
    category: "Супы",
    imageUrl: img("photo-1476224203421-9ac39bcb3327"),
  },
  {
    name: "Солянка мясная",
    description: "Наваристая солянка с копчёностями и оливками",
    price: 11.5,
    calories: 340,
    proteins: 18.0,
    fats: 18.0,
    carbs: 24.0,
    category: "Супы",
    imageUrl: img("photo-1604908176997-125f25cc6f3d"),
  },
  {
    name: "Мисо-суп",
    description: "Традиционный японский суп с тофу и водорослями",
    price: 6.9,
    calories: 90,
    proteins: 6.0,
    fats: 3.0,
    carbs: 8.0,
    category: "Супы",
    imageUrl: img("photo-1617093727343-374698b1b08d"),
  },
  {
    name: "Рамен с курицей",
    description: "Яичная лапша, бульон, яйцо, зелёный лук",
    price: 13.9,
    calories: 520,
    proteins: 28.0,
    fats: 16.0,
    carbs: 58.0,
    category: "Супы",
    imageUrl: img("photo-1569718212165-3a8278d5f624"),
  },

  // Салаты (8)
  {
    name: "Цезарь с курицей",
    description: "Хрустящий салат с пармезаном и соусом цезарь",
    price: 14.5,
    calories: 420,
    proteins: 28.0,
    fats: 24.0,
    carbs: 18.0,
    category: "Салаты",
    imageUrl: img("photo-1512621776951-a57141f2eefd"),
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
    imageUrl: img("photo-1540189549336-e6e99c3679fe"),
  },
  {
    name: "Овощной боул",
    description: "Микс овощей, киноа, авокадо, лимонный соус",
    price: 13.5,
    calories: 380,
    proteins: 12.0,
    fats: 18.0,
    carbs: 42.0,
    category: "Салаты",
    imageUrl: img("photo-1546069901-ba9599a7e63c"),
  },
  {
    name: "Салат с тунцом",
    description: "Тунец, яйцо, оливки, микс зелени",
    price: 15.9,
    calories: 360,
    proteins: 26.0,
    fats: 20.0,
    carbs: 12.0,
    category: "Салаты",
    imageUrl: img("photo-1551248429-40975aa4de74"),
  },
  {
    name: "Капрезе",
    description: "Моцарелла, томаты, базилик, бальзамик",
    price: 11.9,
    calories: 290,
    proteins: 14.0,
    fats: 22.0,
    carbs: 8.0,
    category: "Салаты",
    imageUrl: img("photo-1505253758473-96b7015fcd40"),
  },
  {
    name: "Оливье",
    description: "Классический салат с курицей и майонезом",
    price: 8.5,
    calories: 320,
    proteins: 12.0,
    fats: 22.0,
    carbs: 18.0,
    category: "Салаты",
    imageUrl: img("photo-1546069901-d5bfd2cbfb1f"),
  },
  {
    name: "Винегрет",
    description: "Свёкла, картофель, квашеная капуста, масло",
    price: 7.5,
    calories: 210,
    proteins: 4.0,
    fats: 10.0,
    carbs: 26.0,
    category: "Салаты",
    imageUrl: img("photo-1484723091739-30a097e8f929"),
  },
  {
    name: "Поке с лососем",
    description: "Рис, лосось, эдамаме, соус терияки",
    price: 17.9,
    calories: 480,
    proteins: 28.0,
    fats: 18.0,
    carbs: 48.0,
    category: "Салаты",
    imageUrl: img("photo-1567620905732-2d1ec7ab7445"),
  },

  // Горячее (14)
  {
    name: "Паста карбонара",
    description: "Спагетти с беконом и сливочным соусом",
    price: 16.5,
    calories: 650,
    proteins: 24.0,
    fats: 28.0,
    carbs: 72.0,
    category: "Горячее",
    imageUrl: img("photo-1621996346565-e3dbc646d9a9"),
  },
  {
    name: "Паста болоньезе",
    description: "Феттучини с мясным соусом и пармезаном",
    price: 15.9,
    calories: 620,
    proteins: 26.0,
    fats: 22.0,
    carbs: 70.0,
    category: "Горячее",
    imageUrl: img("photo-1551183053-bf91a1d81141"),
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
    imageUrl: img("photo-1467003909585-2f8a72700288"),
  },
  {
    name: "Стейк рибай",
    description: "Говядина medium, сливочное масло, розмарин",
    price: 32.9,
    calories: 720,
    proteins: 52.0,
    fats: 48.0,
    carbs: 2.0,
    category: "Горячее",
    imageUrl: img("photo-1432139555190-58524dae6a55"),
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
    imageUrl: img("photo-1568901346375-23c9450c58cd"),
  },
  {
    name: "Чизбургер двойной",
    description: "Две котлеты, сыр, маринованные огурцы",
    price: 17.9,
    calories: 890,
    proteins: 42.0,
    fats: 48.0,
    carbs: 56.0,
    category: "Горячее",
    imageUrl: img("photo-1550547660-d9450f859349"),
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
    imageUrl: img("photo-1513104890138-7c749659a591"),
  },
  {
    name: "Пицца пепперони",
    description: "Моцарелла, пепперони, орегано",
    price: 21.5,
    calories: 860,
    proteins: 32.0,
    fats: 34.0,
    carbs: 96.0,
    category: "Горячее",
    imageUrl: img("photo-1565299624946-b28f40a0ae38"),
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
    imageUrl: img("photo-1529692236671-f1f6cf9683ba"),
  },
  {
    name: "Курица гриль",
    description: "Целая курица с травами и картофелем",
    price: 18.9,
    calories: 610,
    proteins: 48.0,
    fats: 32.0,
    carbs: 28.0,
    category: "Горячее",
    imageUrl: img("photo-1598103442097-8b74394b95c6"),
  },
  {
    name: "Котлеты по-домашнему",
    description: "Две котлеты, пюре, соус",
    price: 12.9,
    calories: 580,
    proteins: 28.0,
    fats: 30.0,
    carbs: 42.0,
    category: "Горячее",
    imageUrl: img("photo-1529042410759-befb1204b468"),
  },
  {
    name: "Рёбрышки BBQ",
    description: "Свиные рёбра в соусе барбекю",
    price: 26.9,
    calories: 780,
    proteins: 44.0,
    fats: 52.0,
    carbs: 24.0,
    category: "Горячее",
    imageUrl: img("photo-1544025162-d76694265947"),
  },
  {
    name: "Плов с говядиной",
    description: "Рис, говядина, морковь, специи",
    price: 14.5,
    calories: 640,
    proteins: 26.0,
    fats: 22.0,
    carbs: 78.0,
    category: "Горячее",
    imageUrl: img("photo-1414235077428-338989a2e8c0"),
  },
  {
    name: "Люля-кебаб",
    description: "Фарш на гриле, лаваш, соус",
    price: 16.9,
    calories: 560,
    proteins: 34.0,
    fats: 36.0,
    carbs: 22.0,
    category: "Горячее",
    imageUrl: img("photo-1555939594-58d7cb561ad1"),
  },

  // Суши (6)
  {
    name: "Ролл Филадельфия",
    description: "Лосось, сливочный сыр, огурец",
    price: 18.5,
    calories: 390,
    proteins: 18.0,
    fats: 16.0,
    carbs: 42.0,
    category: "Суши",
    imageUrl: img("photo-1579584425555-c3ce17fd4351"),
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
    imageUrl: img("photo-1553621042-f6e147245754"),
  },
  {
    name: "Ролл Калифорния",
    description: "Краб, авокадо, огурец, икра тобико",
    price: 15.9,
    calories: 340,
    proteins: 12.0,
    fats: 12.0,
    carbs: 44.0,
    category: "Суши",
    imageUrl: img("photo-1579871494447-9811cf80d66c"),
  },
  {
    name: "Нигири лосось",
    description: "6 шт. нигири с лососем",
    price: 16.5,
    calories: 280,
    proteins: 22.0,
    fats: 10.0,
    carbs: 28.0,
    category: "Суши",
    imageUrl: img("photo-1611143669185-af224c5e3252"),
  },
  {
    name: "Ролл Дракон",
    description: "Угорь, авокадо, соус унаги",
    price: 19.9,
    calories: 420,
    proteins: 20.0,
    fats: 18.0,
    carbs: 46.0,
    category: "Суши",
    imageUrl: img("photo-1504674900247-0877df9cc836"),
  },
  {
    name: "Сет Василёк",
    description: "Ассорти из 24 кусочков на компанию",
    price: 42.9,
    calories: 1240,
    proteins: 58.0,
    fats: 42.0,
    carbs: 140.0,
    category: "Суши",
    imageUrl: img("photo-1565958011703-44f9829ba187"),
  },

  // Десерты (6)
  {
    name: "Тирамису",
    description: "Итальянский десерт с маскарпоне",
    price: 9.9,
    calories: 360,
    proteins: 6.5,
    fats: 20.0,
    carbs: 38.0,
    category: "Десерты",
    imageUrl: img("photo-1571877227200-a0d98ea607e9"),
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
    imageUrl: img("photo-1524351199678-941a58a3df50"),
  },
  {
    name: "Шоколадный фондан",
    description: "Тёплый кекс с жидкой шоколадной начинкой",
    price: 11.5,
    calories: 450,
    proteins: 7.0,
    fats: 28.0,
    carbs: 44.0,
    category: "Десерты",
    imageUrl: img("photo-1606313564200-e75d5e30476c"),
  },
  {
    name: "Панна-котта",
    description: "Нежный сливочный десерт с ягодами",
    price: 8.9,
    calories: 280,
    proteins: 5.0,
    fats: 16.0,
    carbs: 28.0,
    category: "Десерты",
    imageUrl: img("photo-1488477181946-6428a0291777"),
  },
  {
    name: "Мороженое ассорти",
    description: "3 шарика на выбор с топпингом",
    price: 7.5,
    calories: 320,
    proteins: 5.0,
    fats: 14.0,
    carbs: 42.0,
    category: "Десерты",
    imageUrl: img("photo-1497034825429-c343d7c6a68f"),
  },
  {
    name: "Медовик",
    description: "Домашний медовый торт со сметанным кремом",
    price: 8.5,
    calories: 390,
    proteins: 6.0,
    fats: 18.0,
    carbs: 52.0,
    category: "Десерты",
    imageUrl: img("photo-1551024506-0bccd828d307"),
  },

  // Напитки (6)
  {
    name: "Смузи манго",
    description: "Освежающий фруктовый смузи",
    price: 7.5,
    calories: 180,
    proteins: 2.0,
    fats: 1.0,
    carbs: 42.0,
    category: "Напитки",
    imageUrl: img("photo-1623065422902-30a2d299bbe4"),
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
    imageUrl: img("photo-1461023058943-07fcbe16d735"),
  },
  {
    name: "Капучино",
    description: "Эспрессо, молоко, плотная пенка",
    price: 6.0,
    calories: 120,
    proteins: 6.0,
    fats: 5.0,
    carbs: 10.0,
    category: "Напитки",
    imageUrl: img("photo-1514432324607-a09d9b4aefdd"),
  },
  {
    name: "Свежевыжатый апельсин",
    description: "300 мл свежего сока",
    price: 8.0,
    calories: 140,
    proteins: 2.0,
    fats: 0.5,
    carbs: 32.0,
    category: "Напитки",
    imageUrl: img("photo-1544145945-f90425340c7e"),
  },
  {
    name: "Лимонад домашний",
    description: "Лимон, мята, сахарный сироп",
    price: 5.5,
    calories: 90,
    proteins: 0.5,
    fats: 0.0,
    carbs: 22.0,
    category: "Напитки",
    imageUrl: img("photo-1622597467836-f3285f2131b8"),
  },
  {
    name: "Зелёный чай матча",
    description: "Латте на матче с молоком",
    price: 7.0,
    calories: 130,
    proteins: 5.0,
    fats: 4.0,
    carbs: 16.0,
    category: "Напитки",
    imageUrl: img("photo-1556679343-c7306c1976bc"),
  },
];

async function downloadImage(url: string, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "FoodDeliverySeed/1.0" },
      });
      if (!response.ok) {
        continue;
      }

      const mime =
        response.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
      if (!mime.startsWith("image/")) {
        continue;
      }

      const imageData = Buffer.from(await response.arrayBuffer());
      if (imageData.byteLength < 1000) {
        continue;
      }

      return { imageData, imageMimeType: mime };
    } catch {
      // retry
    }
  }

  return null;
}

function maskDatabaseUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.password) {
      parsed.password = "***";
    }
    return parsed.toString();
  } catch {
    return "(invalid DATABASE_URL)";
  }
}

async function main() {
  console.log(`Seeding DB: ${maskDatabaseUrl(databaseUrl)}`);

  const existingProducts = await prisma.product.count();
  const existingCategories = await prisma.category.count();
  const existingMenu = await prisma.menuSchedule.count();
  const force =
    process.env.FORCE_SEED === "1" || process.argv.includes("--force");

  if (
    !force &&
    (existingProducts > 0 || existingCategories > 0 || existingMenu > 0)
  ) {
    console.log(
      `Seed skipped: DB already has data (categories=${existingCategories}, products=${existingProducts}, menu=${existingMenu}).`,
    );
    console.log("Перезаписать: npm run db:seed:force");
    return;
  }

  if (force) {
    console.log("--force: очищаю заказы, меню, товары, категории, пользователей…");
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
  let withImages = 0;

  console.log(`Загружаю ${products.length} товаров и картинки…`);

  for (const [index, product] of products.entries()) {
    const image = await downloadImage(product.imageUrl);
    if (image) {
      withImages += 1;
    } else {
      console.warn(`  без фото: ${product.name}`);
    }

    createdProducts.push(
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          grams: randomGrams(product.category),
          calories: product.calories,
          proteins: product.proteins,
          fats: product.fats,
          carbs: product.carbs,
          categoryId: categoryMap.get(product.category)!,
          isActive: true,
          imageData: image?.imageData,
          imageMimeType: image?.imageMimeType,
        },
      }),
    );

    if ((index + 1) % 10 === 0 || index + 1 === products.length) {
      console.log(`  ${index + 1}/${products.length}`);
    }
  }

  const perDay = 5;
  const today = new Date();
  let menuRows = 0;

  for (let offset = 0; offset < 14; offset += 1) {
    const local = new Date(today);
    local.setDate(today.getDate() + offset);
    const date = new Date(
      Date.UTC(local.getFullYear(), local.getMonth(), local.getDate()),
    );

    for (let slot = 0; slot < perDay; slot += 1) {
      const productIndex = (offset * perDay + slot) % createdProducts.length;
      const product = createdProducts[productIndex];
      if (!product) continue;

      await prisma.menuSchedule.create({
        data: {
          productId: product.id,
          date,
        },
      });
      menuRows += 1;
    }
  }

  await prisma.user.create({
    data: {
      phone: "+375291234567",
      name: "Тестовый пользователь",
    },
  });

  console.log(
    `Готово: ${categoryNames.length} категорий, ${createdProducts.length} товаров (${withImages} с фото), ${menuRows} позиций меню на 14 дней.`,
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
