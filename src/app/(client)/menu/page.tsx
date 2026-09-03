"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
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

    loadRange();
  }, [dates]);

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      const response = await fetch(`/api/menu?date=${selectedDate}`);
      const json = await response.json();
      setItems(json.data?.items ?? []);
      setLoading(false);
    }

    loadMenu();
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Меню по датам</p>
        <h1 className="text-2xl font-bold capitalize sm:text-3xl">
          {formatDateLabel(selectedDate)}
        </h1>
      </div>

      <DateTabs
        dates={dates}
        selectedDate={selectedDate}
        datesWithMenu={datesWithMenu}
        onSelect={setSelectedDate}
      />

      {loading ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-muted-foreground">
          Загрузка меню...
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-muted-foreground">
          На эту дату блюда не назначены.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {items.map((item, index) => (
            <ProductCard key={item.id} product={item.product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
