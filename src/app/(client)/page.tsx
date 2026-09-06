import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DayMenuCard } from "@/components/day-menu-card";
import { getMenuForToday } from "@/lib/services/catalog";
import { formatDateLabel, todayDateKey } from "@/lib/utils";

export const dynamic = "force-dynamic";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=80";

export default async function HomePage() {
  const date = todayDateKey();
  const menu = await getMenuForToday();
  const products = menu.map((item) => item.product);

  return (
    <div>
      <section className="-mt-14 sm:-mt-16">
        <div className="relative isolate min-h-[min(92dvh,880px)] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt=""
            className="site-hero-media absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.22_0.05_155/0.88)] via-[oklch(0.25_0.04_150/0.55)] to-[oklch(0.3_0.03_145/0.25)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.04_150/0.75)] via-transparent to-[oklch(0.2_0.03_150/0.35)]" />

          <div className="relative mx-auto flex min-h-[min(92dvh,880px)] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 md:justify-center md:pb-24 md:pt-20">
            <p className="site-rise font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Кафе Василёк
            </p>
            <h1 className="site-rise site-rise-delay-1 mt-4 max-w-xl font-display text-2xl font-medium leading-snug text-white/95 sm:text-3xl md:text-4xl">
              Готовое меню на день — с доставкой
            </h1>
            <p className="site-rise site-rise-delay-2 mt-4 max-w-md text-base text-white/80 sm:text-lg">
              Выберите дату, посмотрите состав блюд и добавьте день в корзину.
            </p>
            <div className="site-rise site-rise-delay-3 mt-8">
              <Link
                href="/menu"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[oklch(0.96_0.02_140)] px-6 text-sm font-semibold text-[oklch(0.3_0.08_155)] transition hover:bg-white"
              >
                Смотреть меню
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-5 px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[oklch(0.45_0.08_155)]">
              Сегодня на кухне
            </p>
            <h2 className="font-display text-2xl font-semibold capitalize tracking-tight sm:text-3xl">
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
          <div className="site-surface rounded-3xl p-8 text-center text-muted-foreground">
            На сегодня меню ещё не назначено.
          </div>
        ) : (
          <DayMenuCard date={date} products={products} />
        )}
      </section>
    </div>
  );
}
