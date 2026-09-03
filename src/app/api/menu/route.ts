import { NextRequest } from "next/server";
import { getMenuForDate, getMenuForToday, getMenuInRange } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { isDateKey, todayDateKey } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date");
    const from = request.nextUrl.searchParams.get("from");
    const to = request.nextUrl.searchParams.get("to");

    if (from && to) {
      if (!isDateKey(from) || !isDateKey(to)) {
        return apiError("from и to должны быть в формате ГГГГ-ММ-ДД", 400);
      }

      const items = await getMenuInRange(from, to);
      return apiSuccess({ from, to, items });
    }

    if (date && !isDateKey(date)) {
      return apiError("date должен быть в формате ГГГГ-ММ-ДД", 400);
    }

    const dateKey = date ?? todayDateKey();
    const items = await getMenuForDate(dateKey);

    return apiSuccess({ date: dateKey, items });
  } catch {
    return apiError("Не удалось загрузить меню", 500);
  }
}
