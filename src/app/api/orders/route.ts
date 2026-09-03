import { NextRequest } from "next/server";
import { requireUserSession } from "@/lib/auth/user-session";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api/response";
import { createOrderSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await requireUserSession();
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid order", 400);
    }

    const productIds = parsed.data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      return apiError("Некоторые товары недоступны", 400);
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    let total = 0;
    const orderItems = parsed.data.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const price = Number(product.price);
      total += price * item.quantity;

      return {
        productId: product.id,
        quantity: item.quantity,
        price,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return apiSuccess(
      {
        id: order.id,
        status: order.status,
        total: Number(order.total),
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: Number(item.price),
          product: {
            id: item.product.id,
            name: item.product.name,
            imageUrl: item.product.imageUrl,
          },
        })),
      },
      201,
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Требуется авторизация", 401);
    }

    return apiError("Не удалось оформить заказ", 500);
  }
}
