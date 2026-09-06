"use client";

import { motion } from "framer-motion";
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
};

export function DayMenuCard({ date, products, index = 0 }: DayMenuCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.05, duration: 0.45 }}
      className="overflow-hidden rounded-[1.75rem] site-surface"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted sm:aspect-[21/9]">
        <ProductImage
          src={cover}
          alt={`Меню на ${formatDateLabel(date)}`}
          className="object-cover transition duration-700 hover:scale-[1.03]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.04_150/0.82)] via-[oklch(0.25_0.03_150/0.2)] to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/75">
              Меню дня
            </p>
            <h2 className="font-display text-2xl font-semibold capitalize sm:text-3xl">
              {formatDateLabel(date)}
            </h2>
          </div>
          <p className="shrink-0 font-display text-2xl font-semibold sm:text-3xl">
            {formatPrice(dayPrice)}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Состав ({products.length})
          </p>
          <ul className="divide-y divide-border/60">
            {products.map((product, productIndex) => (
              <motion.li
                key={product.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + productIndex * 0.04 }}
                className="flex items-start justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{product.name}</p>
                  {product.description ? (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {product.description}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {product.calories} ккал · Б {product.proteins} · Ж{" "}
                    {product.fats} · У {product.carbs}
                    {product.category ? ` · ${product.category}` : ""}
                  </p>
                </div>
                <span className="shrink-0 font-medium text-primary">
                  {formatPrice(product.price)}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <Button className="w-full rounded-2xl" size="lg" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          В корзину
        </Button>
      </div>
    </motion.div>
  );
}
