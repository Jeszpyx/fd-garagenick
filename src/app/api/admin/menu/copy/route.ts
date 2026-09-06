import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { getMenuInRange } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { menuCopySchema } from "@/lib/validations";
import { dateKeyToUtcDate } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const parsed = menuCopySchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid dates", 400);
    }

    if (parsed.data.fromDate === parsed.data.toDate) {
      return apiError("Выберите другую дату назначения", 400);
    }

    const fromDate = dateKeyToUtcDate(parsed.data.fromDate);
    const toDate = dateKeyToUtcDate(parsed.data.toDate);

    await prisma.$transaction(async (tx) => {
      const source = await tx.menuSchedule.findMany({
        where: { date: fromDate },
      });

      await tx.menuSchedule.deleteMany({ where: { date: toDate } });

      if (source.length > 0) {
        await tx.menuSchedule.createMany({
          data: source.map((item) => ({
            productId: item.productId,
            date: toDate,
          })),
        });
      }
    });

    const items = await getMenuInRange(
      parsed.data.toDate,
      parsed.data.toDate,
      false,
      "lite",
    );
    return apiSuccess({
      fromDate: parsed.data.fromDate,
      toDate: parsed.data.toDate,
      items,
    });
  } catch {
    return apiError("Не удалось скопировать меню", 500);
  }
}
