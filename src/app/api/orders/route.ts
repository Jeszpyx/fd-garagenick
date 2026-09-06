import { NextRequest } from "next/server";
import { requireUserSession } from "@/lib/auth/user-session";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api/response";
import { createOrderSchema } from "@/lib/validations";
import { getMenuForDate, serializeProduct } from "@/lib/services/catalog";
import { notifyAdminsAboutOrder } from "@/lib/services/notify";

export async function POST(request: NextRequest) {
  try {
    const session = await requireUserSession();
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Invalid order", 400);
    }

    const dayQuantities = new Map<string, number>();
    for (const item of parsed.data.items) {
      dayQuantities.set(
        item.date,
        (dayQuantities.get(item.date) ?? 0) + item.quantity,
      );
    }

    const productTotals = new Map<
      string,
      { quantity: number; price: number; name: string }
    >();
    const daysForNotify: Array<{
      date: string;
      quantity: number;
      productNames: string[];
    }> = [];
    let total = 0;

    for (const [date, dayQty] of dayQuantities) {
      const menuItems = await getMenuForDate(date);
      if (menuItems.length === 0) {
        return apiError(`На ${date} меню не назначено`, 400);
      }

      daysForNotify.push({
        date,
        quantity: dayQty,
        productNames: menuItems.map((item) => item.product.name),
      });

      for (const menuItem of menuItems) {
        const price = menuItem.product.price;
        const quantity = dayQty;
        total += price * quantity;

        const existing = productTotals.get(menuItem.product.id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          productTotals.set(menuItem.product.id, {
            quantity,
            price,
            name: menuItem.product.name,
          });
        }
      }
    }

    const orderItems = Array.from(productTotals.entries()).map(
      ([productId, { quantity, price }]) => ({
        productId,
        quantity,
        price,
      }),
    );

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        user: {
          select: { id: true, phone: true, name: true },
        },
        items: {
          include: {
            product: {
              omit: { imageData: true },
            },
          },
        },
      },
    });

    void notifyAdminsAboutOrder({
      orderId: order.id,
      createdAt: order.createdAt,
      total: Number(order.total),
      customer: {
        name: order.user.name,
        phone: order.user.phone,
      },
      days: daysForNotify.sort((a, b) => a.date.localeCompare(b.date)),
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
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
            imageUrl: serializeProduct(item.product).imageUrl,
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
