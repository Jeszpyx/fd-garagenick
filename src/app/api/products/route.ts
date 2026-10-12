import { getActiveProducts } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";

export async function GET() {
  try {
    const products = await getActiveProducts();
    const response = apiSuccess(products);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=60",
    );
    return response;
  } catch {
    return apiError("Не удалось загрузить товары", 500);
  }
}
