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
  const [items, setItems] = useState<MenuItem[]>([]);
  const [datesWithMenu, setDatesWithMenu] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRange() {
      const from = dates[0];
      const to = dates[dates.length - 1];
      const response = await fetch(`/api/menu?from=${from}&to=${to}`);
      const json = await response.json();
      const rangeItems = (json.data?.items ?? []) as MenuItem[];
      setDatesWithMenu(new Set(rangeItems.map((item) => item.date)));
    }

    void loadRange();
  }, [dates]);

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      const response = await fetch(`/api/menu?date=${selectedDate}`);
      const json = await response.json();
      setItems(json.data?.items ?? []);
      setLoading(false);
    }

    void loadMenu();
  }, [selectedDate]);

  const products = items.map((item) => item.product);

  return (
    <div className="space-y-6 px-4 pt-4 sm:px-6 sm:pt-6">
      <div>
        <p className="text-sm font-medium text-[oklch(0.45_0.08_155)]">
          Заказ по дням
        </p>
        <h1 className="font-display text-3xl font-semibold capitalize tracking-tight sm:text-4xl">
          {formatDateLabel(selectedDate)}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
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
        <div className="site-surface rounded-3xl p-8 text-center text-muted-foreground">
          Загрузка меню...
        </div>
      ) : products.length === 0 ? (
        <div className="site-surface rounded-3xl p-8 text-center text-muted-foreground">
          На эту дату меню ещё не назначено.
        </div>
      ) : (
        <DayMenuCard date={selectedDate} products={products} />
      )}
    </div>
  );
}
