"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const [submitting, setSubmitting] = useState(false);

  async function handleCheckout() {
    setSubmitting(true);

    try {
      const meResponse = await fetch("/api/auth/me");
      if (!meResponse.ok) {
        toast.error("Войдите по номеру телефона, чтобы оформить заказ");
        router.push("/login?redirect=/cart");
        return;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error ?? "Не удалось оформить заказ");
        return;
      }

      clearCart();
      toast.success("Заказ успешно оформлен");
      router.push(`/order-success?orderId=${json.data.id}`);
    } catch {
      toast.error("Ошибка сети при оформлении заказа");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="glass-panel mx-auto max-w-xl rounded-2xl p-6 text-center sm:rounded-3xl sm:p-10">
        <h1 className="text-2xl font-semibold">Корзина пуста</h1>
        <p className="mt-2 text-muted-foreground">
          Добавьте блюда из меню или каталога.
        </p>
        <Button className="mt-6 w-full sm:w-auto" onClick={() => router.push("/catalog")}>
          Перейти в каталог
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold sm:text-3xl">Корзина</h1>
        {items.map((item) => (
          <Card key={item.productId} className="overflow-hidden">
            <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted sm:h-20 sm:w-20">
                  <ProductImage
                    src={item.imageUrl}
                    alt={item.name}
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-fit p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 className="text-xl font-semibold">Итого</h2>
        <p className="mt-4 text-3xl font-bold text-primary">
          {formatPrice(totalPrice)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Для оформления потребуется вход по номеру телефона.
        </p>
        <Button
          className="mt-6 w-full"
          disabled={submitting}
          onClick={handleCheckout}
        >
          {submitting ? "Оформляем..." : "Оформить заказ"}
        </Button>
        <Link
          href="/catalog"
          className="mt-3 block text-center text-sm text-primary"
        >
          Продолжить покупки
        </Link>
      </Card>
    </div>
  );
}
