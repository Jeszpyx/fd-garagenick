"use client";

import { cn, formatDateLabel } from "@/lib/utils";

type DateTabsProps = {
  dates: string[];
  selectedDate: string;
  datesWithMenu: Set<string>;
  onSelect: (date: string) => void;
};

export function DateTabs({
  dates,
  selectedDate,
  datesWithMenu,
  onSelect,
}: DateTabsProps) {
  return (
    <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 snap-x snap-mandatory sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {dates.map((date) => {
        const selected = date === selectedDate;
        const weekday = formatDateLabel(date, { weekday: "short" });
        const day = formatDateLabel(date, { day: "numeric" });
        const month = formatDateLabel(date, { month: "short" });

        return (
          <button
            key={date}
            type="button"
            onClick={() => onSelect(date)}
            className={cn(
              "relative shrink-0 snap-start rounded-2xl px-3 py-2.5 text-left transition sm:min-w-[5.5rem] sm:px-4",
              selected
                ? "bg-primary text-primary-foreground"
                : "site-surface text-secondary-foreground hover:bg-accent",
            )}
          >
            <span className="block text-[11px] uppercase opacity-80">
              {weekday}
            </span>
            <span className="block text-sm font-semibold">
              {day} {month}
            </span>
            {datesWithMenu.has(date) ? (
              <span
                className={cn(
                  "absolute right-2 top-2 h-1.5 w-1.5 rounded-full",
                  selected ? "bg-primary-foreground" : "bg-primary",
                )}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
