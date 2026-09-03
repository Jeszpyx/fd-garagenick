import { NextRequest } from "next/server";
import { getMenuForDay } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getTodayDayOfWeek } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const dayParam = request.nextUrl.searchParams.get("day");
    const dayOfWeek =
      dayParam === null ? getTodayDayOfWeek() : Number.parseInt(dayParam, 10);

    if (Number.isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      return apiError("day must be between 0 and 6", 400);
    }

    const menu = await getMenuForDay(dayOfWeek);
    return apiSuccess({ dayOfWeek, items: menu });
  } catch {
    return apiError("Не удалось загрузить меню", 500);
  }
}
