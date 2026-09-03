import Link from "next/link";

export const dynamic = "force-dynamic";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { getMenuForDay } from "@/lib/services/catalog";
import { DAY_FULL_LABELS, getTodayDayOfWeek } from "@/lib/utils";

export default async function HomePage() {
  const dayOfWeek = getTodayDayOfWeek();
  const menu = await getMenuForDay(dayOfWeek);

  return (
    <div className="space-y-10">
      <section className="glass-panel relative overflow-hidden rounded-3xl p-8 md:p-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative space-y-4">
          <Badge className="bg-primary/15 text-primary">
            <Sparkles className="mr-1 h-3 w-3" />
            Меню 2026
          </Badge>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            Свежая еда с доставкой за 30 минут
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Выбирайте блюда дня, собирайте корзину и оформляйте заказ после
            быстрой регистрации по номеру телефона.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20"
            >
              Смотреть меню
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/catalog"
              className="inline-flex h-11 items-center rounded-xl border border-border bg-background/60 px-5 text-sm font-medium hover:bg-accent"
            >
              Весь каталог
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Сегодня</p>
            <h2 className="text-2xl font-semibold">
              Меню на {DAY_FULL_LABELS[dayOfWeek].toLowerCase()}
            </h2>
          </div>
          <Link href="/menu" className="text-sm font-medium text-primary">
            Все дни недели
          </Link>
        </div>

        {menu.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-muted-foreground">
            На сегодня блюда ещё не назначены.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
