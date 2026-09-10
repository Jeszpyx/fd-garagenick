import Link from "next/link";
import { DayMenuCard } from "@/components/day-menu-card";
import { HomeHero } from "@/components/home-hero";
import { getMenuForToday } from "@/lib/services/catalog";
import { formatDateLabel, todayDateKey } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const date = todayDateKey();
  const menu = await getMenuForToday();
  const products = menu.map((item) => item.product);

  return (
    <div className="w-full">
      <HomeHero />

      <section className="site-shell space-y-5 py-8 sm:py-10 lg:py-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[oklch(0.45_0.08_155)]">
              Сегодня на кухне
            </p>
            <h2 className="font-display text-2xl font-semibold capitalize tracking-tight sm:text-3xl lg:text-4xl">
              {formatDateLabel(date)}
            </h2>
          </div>
          <Link
            href="/menu"
            className="shrink-0 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Другие даты
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="site-surface rounded-3xl p-8 text-center text-muted-foreground sm:p-12">
            На сегодня меню ещё не назначено.
          </div>
        ) : (
          <DayMenuCard date={date} products={products} />
        )}
      </section>
    </div>
  );
}
