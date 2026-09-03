import { getActiveProducts } from "@/lib/services/catalog";
import { apiError, apiSuccess } from "@/lib/api/response";

export async function GET() {
  try {
    const products = await getActiveProducts();
    return apiSuccess(products);
  } catch {
    return apiError("Не удалось загрузить товары", 500);
  }
}
