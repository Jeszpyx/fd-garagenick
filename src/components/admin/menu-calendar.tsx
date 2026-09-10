"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Copy, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { adminFetch, clearAdminToken } from "@/lib/api/admin-client";
import type { MenuItem, Product } from "@/types";
import {
  addDaysToDateKey,
  cn,
  DAY_LABELS,
  formatDateLabel,
  formatPrice,
  getMonthCells,
  todayDateKey,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProductOption = Pick<Product, "id" | "name" | "price" | "isActive">;

export function MenuCalendar() {
  const router = useRouter();
  const today = todayDateKey();
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [copyToDate, setCopyToDate] = useState(addDaysToDateKey(today, 1));
  const [copyFromDate, setCopyFromDate] = useState("");
  const [loading, setLoading] = useState(true);

  const cells = useMemo(
    () => getMonthCells(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  );

  const rangeFrom = cells[0]?.dateKey ?? today;
  const rangeTo = cells[cells.length - 1]?.dateKey ?? today;

  const handleUnauthorized = useCallback(() => {
    clearAdminToken();
    router.replace("/admin/login");
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const productsResult = await adminFetch<ProductOption[]>(
        "/api/admin/products?lite=1",
      );
      if (cancelled) return;

      if (
        productsResult.status === 401 ||
        productsResult.error === "Unauthorized"
      ) {
        handleUnauthorized();
        return;
      }

      if (productsResult.error) {
        toast.error(productsResult.error);
        return;
      }

      setProducts(productsResult.data ?? []);
    }

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, [handleUnauthorized]);

  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      setLoading(true);
      const menuResult = await adminFetch<{ items: MenuItem[] }>(
        `/api/admin/menu?from=${rangeFrom}&to=${rangeTo}`,
      );
      if (cancelled) return;

      if (menuResult.status === 401 || menuResult.error === "Unauthorized") {
        handleUnauthorized();
        return;
      }

      if (menuResult.error) {
        toast.error(menuResult.error);
        setLoading(false);
        return;
      }

      setMenu(menuResult.data?.items ?? []);
      setLoading(false);
    }

    void loadMenu();
    return () => {
      cancelled = true;
    };
  }, [rangeFrom, rangeTo, handleUnauthorized]);

  const menuByDate = useMemo(() => {
    const grouped = new Map<string, MenuItem[]>();
    for (const item of menu) {
      const current = grouped.get(item.date) ?? [];
      current.push(item);
      grouped.set(item.date, current);
    }
    return grouped;
  }, [menu]);

  const selectedItems = menuByDate.get(selectedDate) ?? [];
  const monthTitle = useMemo(
    () =>
      new Intl.DateTimeFormat("ru-RU", {
        month: "long",
        year: "numeric",
      }).format(new Date(cursor.year, cursor.month, 1)),
    [cursor.year, cursor.month],
  );

  const activeProducts = useMemo(
    () => products.filter((product) => product.isActive),
    [products],
  );

  function shiftMonth(delta: number) {
    setCursor((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  async function addDish() {
    if (!selectedProductId) {
      toast.error("Выберите блюдо");
      return;
    }

    const result = await adminFetch<MenuItem>("/api/admin/menu", {
      method: "POST",
      body: JSON.stringify({
        productId: selectedProductId,
        date: selectedDate,
      }),
    });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Блюдо добавлено на выбранную дату");
    setSelectedProductId("");
    if (result.data) {
      setMenu((current) => {
        if (current.some((item) => item.id === result.data?.id)) {
          return current;
        }
        return [...current, result.data!];
      });
    }
  }

  async function removeDish(id: string) {
    const previous = menu;
    setMenu((current) => current.filter((item) => item.id !== id));

    const result = await adminFetch(`/api/admin/menu/${id}`, {
      method: "DELETE",
    });

    if (result.error) {
      setMenu(previous);
      toast.error(result.error);
      return;
    }

    toast.success("Блюдо убрано с этой даты");
  }

  async function copyMenu(fromDate: string, toDate: string) {
    const result = await adminFetch<{ items?: MenuItem[] }>(
      "/api/admin/menu/copy",
      {
        method: "POST",
        body: JSON.stringify({ fromDate, toDate }),
      },
    );

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Вариант меню скопирован");

    const menuResult = await adminFetch<{ items: MenuItem[] }>(
      `/api/admin/menu?from=${rangeFrom}&to=${rangeTo}`,
    );
    if (!menuResult.error) {
      setMenu(menuResult.data?.items ?? []);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
      <Card>
        <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="capitalize">{monthTitle}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => shiftMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const now = new Date();
                setCursor({ year: now.getFullYear(), month: now.getMonth() });
                setSelectedDate(today);
              }}
            >
              Сегодня
            </Button>
            <Button variant="outline" size="icon" onClick={() => shiftMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-3 sm:p-6">
          <div className="mb-2 grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-muted-foreground sm:gap-1 sm:text-xs">
            {DAY_LABELS.map((label) => (
              <div key={label} className="py-2">
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {cells.map((cell) => {
              const items = menuByDate.get(cell.dateKey) ?? [];
              const selected = cell.dateKey === selectedDate;
              const isToday = cell.dateKey === today;

              return (
                <button
                  key={cell.dateKey}
                  type="button"
                  onClick={() => {
                    setSelectedDate(cell.dateKey);
                    setCopyToDate(addDaysToDateKey(cell.dateKey, 1));
                  }}
                  className={cn(
                    "flex min-h-11 flex-col items-center justify-center rounded-lg border p-1 text-center transition sm:min-h-24 sm:items-stretch sm:rounded-2xl sm:p-2 sm:text-left",
                    cell.inMonth ? "bg-background/70" : "bg-muted/30 text-muted-foreground",
                    selected && "border-primary bg-primary/10 shadow-sm",
                    !selected && "border-border/70 hover:border-primary/40",
                    isToday && !selected && "ring-1 ring-primary/40",
                  )}
                >
                  <div className="flex w-full items-center justify-center gap-1 sm:justify-between">
                    <span className="text-xs font-semibold sm:text-sm">{cell.day}</span>
                    {items.length > 0 ? (
                      <span className="rounded-md bg-primary px-1 text-[9px] text-primary-foreground sm:px-1.5 sm:text-[10px]">
                        {items.length}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 hidden space-y-0.5 sm:block">
                    {items.slice(0, 2).map((item) => (
                      <p key={item.id} className="truncate text-[11px]">
                        {item.product.name}
                      </p>
                    ))}
                    {items.length > 2 ? (
                      <p className="text-[11px] text-muted-foreground">
                        +{items.length - 2}
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
          {loading ? (
            <p className="mt-3 text-sm text-muted-foreground">Обновление...</p>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {formatDateLabel(selectedDate, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <select
                className="h-11 w-full min-w-0 rounded-xl border border-input bg-background/70 px-3 text-base sm:px-4 sm:text-sm"
                value={selectedProductId}
                onChange={(event) => setSelectedProductId(event.target.value)}
              >
                <option value="">Блюдо для этой даты</option>
                {activeProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} · {formatPrice(product.price)}
                  </option>
                ))}
              </select>
              <Button className="w-full sm:w-auto" onClick={addDish}>
                <Plus className="h-4 w-4" />
                Добавить
              </Button>
            </div>

            {selectedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                На {formatDateLabel(selectedDate, { day: "numeric", month: "long" })} блюд пока нет.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedItems.map((item) => (
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Другой вариант на дату</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Скопировать текущее меню на другую дату
              </p>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  type="date"
                  className="h-11 w-full min-w-0 rounded-xl border border-input bg-background/70 px-3 text-base sm:px-4 sm:text-sm"
                  value={copyToDate}
                  onChange={(event) => setCopyToDate(event.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => copyMenu(selectedDate, copyToDate)}
                >
                  <Copy className="h-4 w-4" />
                  Копировать
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Подставить меню с другой даты
              </p>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  type="date"
                  className="h-11 w-full min-w-0 rounded-xl border border-input bg-background/70 px-3 text-base sm:px-4 sm:text-sm"
                  value={copyFromDate}
                  onChange={(event) => setCopyFromDate(event.target.value)}
                />
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  disabled={!copyFromDate}
                  onClick={() => copyMenu(copyFromDate, selectedDate)}
                >
                  Подставить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
