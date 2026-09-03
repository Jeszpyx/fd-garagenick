"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const response = await fetch("/api/products");
      const json = await response.json();
      setProducts(json.data ?? []);
      setLoading(false);
    }

    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.category?.toLowerCase().includes(normalized),
    );
  }, [products, query]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Каталог</h1>
        <p className="text-muted-foreground">
          Все доступные блюда и напитки
        </p>
      </div>

      <Input
        placeholder="Поиск по названию или категории"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {loading ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-muted-foreground">
          Загрузка каталога...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-muted-foreground">
          Ничего не найдено.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
