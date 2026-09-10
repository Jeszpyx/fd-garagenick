"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ensureUserSession } from "@/lib/api/user-client";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
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
      const signedIn = await ensureUserSession();
      if (!signedIn) {
        toast.error("Войдите по номеру телефона, чтобы оформить заказ");
        router.push("/login?redirect=/cart");
        return;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            date: item.date,
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
      <div className="site-shell flex flex-1 items-center justify-center py-10 sm:py-16">
        <div className="site-surface w-full max-w-xl rounded-3xl p-6 text-center sm:p-10">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">
            Корзина пуста
          </h1>
          <p className="mt-2 text-muted-foreground">
            Добавьте дни меню — состав каждого дня задан на кухне.
          </p>
          <Button
            className="mt-6 w-full sm:w-auto"
            onClick={() => router.push("/menu")}
          >
            Перейти к меню
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="site-shell grid gap-6 py-4 sm:py-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)] lg:gap-8 lg:py-8">
      <div className="min-w-0 space-y-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Корзина
        </h1>
        {items.map((item) => (
          <Card key={item.date} className="overflow-hidden">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold capitalize sm:text-lg">
                  {item.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.productNames.join(", ")}
                </p>
                <p className="mt-1 text-sm font-medium text-primary">
                  {formatPrice(item.price)} / день
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.date, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.date, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.date)}
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
        <p className="mt-4 font-display text-3xl font-bold text-primary sm:text-4xl">
          {formatPrice(totalPrice)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Для оформления потребуется вход по номеру телефона.
        </p>
        <Button
          className="mt-6 w-full"
          size="lg"
          disabled={submitting}
          onClick={handleCheckout}
        >
          {submitting ? "Оформляем..." : "Оформить заказ"}
        </Button>
        <Link
          href="/menu"
          className="mt-3 block text-center text-sm font-medium text-primary"
        >
          Выбрать другие дни
        </Link>
      </Card>
    </div>
  );
}
