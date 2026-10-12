import { NextRequest } from "next/server";
import { getMenuForDate, getMenuInRange } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";
import { isDateKey, todayDateKey } from "@/lib/utils";

const MENU_CACHE =
  "public, s-maxage=30, stale-while-revalidate=60";

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date");
    const from = request.nextUrl.searchParams.get("from");
    const to = request.nextUrl.searchParams.get("to");
    const lite = request.nextUrl.searchParams.get("lite") === "1";

    if (from && to) {
      if (!isDateKey(from) || !isDateKey(to)) {
        return apiError("from и to должны быть в формате ГГГГ-ММ-ДД", 400);
      }

      const items = await getMenuInRange(from, to, true, lite ? "lite" : "full");
      const response = apiSuccess({ from, to, items });
      response.headers.set("Cache-Control", MENU_CACHE);
      return response;
    }

    if (date && !isDateKey(date)) {
      return apiError("date должен быть в формате ГГГГ-ММ-ДД", 400);
    }

    const dateKey = date ?? todayDateKey();
    const items = await getMenuForDate(dateKey);
    const response = apiSuccess({ date: dateKey, items });
    response.headers.set("Cache-Control", MENU_CACHE);
    return response;
  } catch {
    return apiError("Не удалось загрузить меню", 500);
  }
}
