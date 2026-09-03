"use client";

import Image from "next/image";
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
      transition={{ delay: index * 0.05 }}
    >
      <Card className="overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
              Нет фото
            </div>
          )}
        </div>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              {product.category ? <Badge>{product.category}</Badge> : null}
              <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
              {product.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
              ) : null}
            </div>
            <p className="text-lg font-bold text-primary">
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
