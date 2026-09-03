"use client";

import { cn, DAY_LABELS } from "@/lib/utils";

type DayTabsProps = {
  selectedDay: number;
  onSelect: (day: number) => void;
};

export function DayTabs({ selectedDay, onSelect }: DayTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {DAY_LABELS.map((label, index) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect(index)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
            selectedDay === index
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "bg-secondary text-secondary-foreground hover:bg-accent",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
