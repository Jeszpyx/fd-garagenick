import { getMenuForToday } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { todayDateKey } from "@/lib/utils";

export async function GET() {
  try {
    const date = todayDateKey();
    const items = await getMenuForToday();

    return apiSuccess({ date, items });
  } catch (error) {
    console.error("GET /api/menu/today", error);
    return apiError("Не удалось загрузить меню на сегодня", 500);
  }
}
