"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/api/admin-client";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);
    const result = await adminFetch<Product[]>("/api/admin/products");
    if (result.error) {
      if (result.error === "Unauthorized") {
        router.push("/admin/login");
        return;
      }
      toast.error(result.error);
    } else {
      setProducts(result.data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id: string) {
    const result = await adminFetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Товар удалён");
    loadProducts();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Товары</h1>
        <p className="text-muted-foreground">
          Управление каталогом и ценами
        </p>
      </div>

      <ProductForm
        editing={editing}
        onSuccess={() => {
          setEditing(null);
          loadProducts();
        }}
        onCancel={() => setEditing(null)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Список товаров</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-muted-foreground">Загрузка...</p>
          ) : products.length === 0 ? (
            <p className="text-muted-foreground">Товаров пока нет.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/70 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category ?? "Без категории"} ·{" "}
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(product)}
                  >
                    <Pencil className="h-4 w-4" />
                    Изменить
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Удалить
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
