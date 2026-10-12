"use client";

import { useEffect, useMemo, useState } from "react";
import { DayMenuCard } from "@/components/day-menu-card";
import { DateTabs } from "@/components/date-tabs";
import type { MenuItem } from "@/types";
import { addDaysToDateKey, formatDateLabel, todayDateKey } from "@/lib/utils";

export default function MenuPage() {
  const today = todayDateKey();
  const dates = useMemo(
    () => Array.from({ length: 14 }, (_, index) => addDaysToDateKey(today, index)),
    [today],
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [rangeItems, setRangeItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadRange() {
      setLoading(true);
      try {
        const from = dates[0];
        const to = dates[dates.length - 1];
        const response = await fetch(`/api/menu?from=${from}&to=${to}`);
        const json = await response.json();
        if (cancelled) return;
        setRangeItems((json.data?.items ?? []) as MenuItem[]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadRange();
    return () => {
      cancelled = true;
    };
  }, [dates]);

  const datesWithMenu = useMemo(
    () => new Set(rangeItems.map((item) => item.date)),
    [rangeItems],
  );

  const items = useMemo(
    () => rangeItems.filter((item) => item.date === selectedDate),
    [rangeItems, selectedDate],
  );

  const products = useMemo(
    () => items.map((item) => item.product),
    [items],
  );

  return (
    <div className="site-shell space-y-6 py-4 sm:py-6 lg:py-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-[oklch(0.45_0.08_155)]">
          Заказ по дням
        </p>
        <h1 className="font-display text-3xl font-semibold capitalize tracking-tight sm:text-4xl lg:text-5xl">
          {formatDateLabel(selectedDate)}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Выберите дату и добавьте день в корзину. Состав блюд задаётся на
          кухне.
        </p>
      </div>

      <DateTabs
        dates={dates}
        selectedDate={selectedDate}
        datesWithMenu={datesWithMenu}
        onSelect={setSelectedDate}
      />

      {loading ? (
        <div className="site-surface rounded-3xl p-8 text-center text-muted-foreground sm:p-12">
          Загрузка меню...
        </div>
      ) : products.length === 0 ? (
        <div className="site-surface rounded-3xl p-8 text-center text-muted-foreground sm:p-12">
          На эту дату меню ещё не назначено.
        </div>
      ) : (
        <DayMenuCard date={selectedDate} products={products} />
      )}
    </div>
  );
}
