import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { getMenuForToday } from "@/lib/services/catalog";
import { formatDateLabel, todayDateKey } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const date = todayDateKey();
  const menu = await getMenuForToday();

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="glass-panel relative overflow-hidden rounded-2xl p-5 sm:rounded-3xl sm:p-8 md:p-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative space-y-4">
          <Badge className="bg-primary/15 text-primary">
            <Sparkles className="mr-1 h-3 w-3" />
            Меню 2026
          </Badge>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Свежая еда с доставкой за 30 минут
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Выбирайте блюда дня, собирайте корзину и оформляйте заказ после
            быстрой регистрации по номеру телефона.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/menu"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 sm:w-auto"
            >
              Смотреть меню
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/catalog"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background/60 px-5 text-sm font-medium hover:bg-accent sm:w-auto"
            >
              Весь каталог
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Сегодня</p>
            <h2 className="text-xl font-semibold capitalize sm:text-2xl">
              Меню на {formatDateLabel(date)}
            </h2>
          </div>
          <Link href="/menu" className="shrink-0 text-sm font-medium text-primary">
            Другие даты
          </Link>
        </div>

        {menu.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-center text-muted-foreground sm:p-8">
            На сегодня блюда ещё не назначены.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {menu.map((item, index) => (
              <ProductCard
                key={item.id}
                product={item.product}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
