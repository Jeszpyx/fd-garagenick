import { getMenuForDay } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getTodayDayOfWeek } from "@/lib/utils";

export async function GET() {
  try {
    const dayOfWeek = getTodayDayOfWeek();
    const menu = await getMenuForDay(dayOfWeek);

    return apiSuccess({ dayOfWeek, items: menu });
  } catch {
    return apiError("Не удалось загрузить меню на сегодня", 500);
  }
}
