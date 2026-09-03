"use client";

import { ProductImage } from "@/components/product-image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} добавлен в корзину`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.04 }}
    >
      <Card className="h-full overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/3]">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="object-cover transition duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <CardContent className="space-y-3 p-3 sm:p-4">
          <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              {product.category ? <Badge>{product.category}</Badge> : null}
              <h3 className="mt-2 text-base font-semibold leading-snug sm:text-lg">
                {product.name}
              </h3>
              {product.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
              ) : null}
            </div>
            <p className="shrink-0 text-base font-bold text-primary sm:text-lg">
              {formatPrice(product.price)}
            </p>
          </div>
          <Button className="w-full" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            В корзину
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
