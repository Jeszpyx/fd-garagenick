import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { getMenuInRange, serializeMenuItem } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { menuScheduleSchema } from "@/lib/validations";
import {
  addDaysToDateKey,
  dateKeyToUtcDate,
  isDateKey,
  todayDateKey,
} from "@/lib/utils";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const fromParam = request.nextUrl.searchParams.get("from");
    const toParam = request.nextUrl.searchParams.get("to");
    const from =
      fromParam && isDateKey(fromParam)
        ? fromParam
        : todayDateKey().slice(0, 8) + "01";
    const to =
      toParam && isDateKey(toParam) ? toParam : addDaysToDateKey(from, 40);

    const menu = await getMenuInRange(from, to, false, "lite");
    return apiSuccess({ from, to, items: menu });
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
      select: { id: true },
    });

    if (!product) {
      return apiError("Товар не найден", 404);
    }

    const date = dateKeyToUtcDate(parsed.data.date);

    const item = await prisma.menuSchedule.upsert({
      where: {
        productId_date: {
          productId: parsed.data.productId,
          date,
        },
      },
      update: {},
      create: {
        productId: parsed.data.productId,
        date,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            isActive: true,
          },
        },
      },
    });

    return apiSuccess(serializeMenuItem(item), 201);
  } catch {
    return apiError("Не удалось добавить блюдо в меню", 500);
  }
}
