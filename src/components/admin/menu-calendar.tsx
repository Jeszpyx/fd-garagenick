"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/api/admin-client";
import type { MenuItem, Product } from "@/types";
import { DAY_FULL_LABELS, DAY_LABELS, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MenuCalendar() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const [menuResult, productsResult] = await Promise.all([
      adminFetch<MenuItem[]>("/api/admin/menu"),
      adminFetch<Product[]>("/api/admin/products"),
    ]);

    if (menuResult.error === "Unauthorized" || productsResult.error === "Unauthorized") {
      router.push("/admin/login");
      return;
    }

    if (menuResult.error || productsResult.error) {
      toast.error(menuResult.error ?? productsResult.error ?? "Ошибка загрузки");
      setLoading(false);
      return;
    }

    setMenu(menuResult.data ?? []);
    setProducts(productsResult.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const menuByDay = useMemo(() => {
    return DAY_LABELS.map((_, day) =>
      menu.filter((item) => item.dayOfWeek === day),
    );
  }, [menu]);

  async function addDish() {
    if (selectedDay === null || !selectedProductId) {
      toast.error("Выберите день и блюдо");
      return;
    }

    const result = await adminFetch("/api/admin/menu", {
      method: "POST",
      body: JSON.stringify({
        productId: selectedProductId,
        dayOfWeek: selectedDay,
      }),
    });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Блюдо добавлено в меню");
    setSelectedProductId("");
    setSelectedDay(null);
    loadData();
  }

  async function removeDish(id: string) {
    const result = await adminFetch(`/api/admin/menu/${id}`, {
      method: "DELETE",
    });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Блюдо удалено из меню");
    loadData();
  }

  if (loading) {
    return <p className="text-muted-foreground">Загрузка календаря...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Добавить блюдо в день</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <select
            className="h-11 rounded-xl border border-input bg-background/70 px-4 text-sm"
            value={selectedDay ?? ""}
            onChange={(event) =>
              setSelectedDay(
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
          >
            <option value="">Выберите день</option>
            {DAY_FULL_LABELS.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="h-11 rounded-xl border border-input bg-background/70 px-4 text-sm"
            value={selectedProductId}
            onChange={(event) => setSelectedProductId(event.target.value)}
          >
            <option value="">Выберите блюдо</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} · {formatPrice(product.price)}
              </option>
            ))}
          </select>
          <Button onClick={addDish}>
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-7">
        {menuByDay.map((items, day) => (
          <Card key={DAY_LABELS[day]} className="min-h-[280px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{DAY_FULL_LABELS[day]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">Нет блюд</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-2 rounded-xl bg-primary/10 px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg p-1 hover:bg-background/60"
                      onClick={() => removeDish(item.id)}
                      aria-label="Удалить"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
