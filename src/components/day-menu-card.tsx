"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { formatDateLabel, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";

type DayMenuCardProps = {
  date: string;
  products: Product[];
  index?: number;
  priorityImage?: boolean;
};

export function DayMenuCard({
  date,
  products,
  priorityImage = false,
}: DayMenuCardProps) {
  const addDay = useCartStore((state) => state.addDay);
  const dayPrice = products.reduce((sum, product) => sum + product.price, 0);
  const productNames = products.map((product) => product.name);
  const cover = products.find((product) => product.imageUrl)?.imageUrl ?? null;

  function handleAdd() {
    addDay({
      date,
      label: formatDateLabel(date),
      price: dayPrice,
      productNames,
    });
    toast.success(`Меню на ${formatDateLabel(date)} добавлено в корзину`);
  }

  return (
    <div className="site-surface overflow-hidden rounded-[1.75rem] md:grid md:grid-cols-[1.1fr_1fr] xl:grid-cols-[1.2fr_1fr]">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted sm:aspect-[2/1] md:aspect-auto md:min-h-[22rem] lg:min-h-[28rem]">
        <ProductImage
          src={cover}
          alt={`Меню на ${formatDateLabel(date)}`}
          className="object-cover transition duration-700 hover:scale-[1.03]"
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={priorityImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.04_150/0.82)] via-[oklch(0.25_0.03_150/0.2)] to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white sm:bottom-5 sm:left-5 sm:right-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/75">
              Меню дня
            </p>
            <h2 className="font-display text-2xl font-semibold capitalize sm:text-3xl lg:text-4xl">
              {formatDateLabel(date)}
            </h2>
          </div>
          <p className="shrink-0 font-display text-2xl font-semibold sm:text-3xl">
            {formatPrice(dayPrice)}
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-5 p-4 sm:p-6 lg:p-8">
        <div className="min-h-0 flex-1">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Состав ({products.length})
          </p>
          <ul className="divide-y divide-border/60">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-start justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0 sm:gap-4 sm:py-3.5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <p className="font-semibold sm:text-base">{product.name}</p>
                    <span className="text-xs font-medium text-primary sm:text-sm">
                      {product.grams > 0 ? `${product.grams} г` : "вес не указан"}
                    </span>
                  </div>
                  {product.description ? (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                      {product.description}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {product.calories} ккал · Б {product.proteins} · Ж{" "}
                    {product.fats} · У {product.carbs}
                    {product.category ? ` · ${product.category}` : ""}
                  </p>
                </div>
                <span className="shrink-0 font-medium text-primary sm:text-base">
                  {formatPrice(product.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Button className="w-full rounded-2xl" size="lg" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          В корзину
        </Button>
      </div>
    </div>
  );
}
