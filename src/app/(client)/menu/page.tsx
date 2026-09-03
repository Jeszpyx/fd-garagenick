"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { DayTabs } from "@/components/day-tabs";
import type { MenuItem } from "@/types";
import { DAY_FULL_LABELS, getTodayDayOfWeek } from "@/lib/utils";

export default function MenuPage() {
  const [selectedDay, setSelectedDay] = useState(getTodayDayOfWeek());
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      const response = await fetch(`/api/menu?day=${selectedDay}`);
      const json = await response.json();
      setItems(json.data?.items ?? []);
      setLoading(false);
    }

    loadMenu();
  }, [selectedDay]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Недельное меню</p>
        <h1 className="text-3xl font-bold">{DAY_FULL_LABELS[selectedDay]}</h1>
      </div>

      <DayTabs selectedDay={selectedDay} onSelect={setSelectedDay} />

      {loading ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-muted-foreground">
          Загрузка меню...
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-muted-foreground">
          На этот день блюда не назначены.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <ProductCard key={item.id} product={item.product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
