import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { getWeeklyMenu, serializeProduct } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { menuScheduleSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const menu = await getWeeklyMenu();
    return apiSuccess(menu);
  } catch {
    return apiError("Не удалось загрузить меню", 500);
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const parsed = menuScheduleSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid menu item", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId },
    });

    if (!product) {
      return apiError("Товар не найден", 404);
    }

    const item = await prisma.menuSchedule.upsert({
      where: {
        productId_dayOfWeek: {
          productId: parsed.data.productId,
          dayOfWeek: parsed.data.dayOfWeek,
        },
      },
      update: {},
      create: {
        productId: parsed.data.productId,
        dayOfWeek: parsed.data.dayOfWeek,
      },
      include: { product: true },
    });

    return apiSuccess(
      {
        id: item.id,
        dayOfWeek: item.dayOfWeek,
        product: serializeProduct(item.product),
      },
      201,
    );
  } catch {
    return apiError("Не удалось добавить блюдо в меню", 500);
  }
}
