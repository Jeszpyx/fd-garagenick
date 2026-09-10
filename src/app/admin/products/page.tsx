"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminFetch, clearAdminToken } from "@/lib/api/admin-client";
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
    const isInitial = products.length === 0;
    if (isInitial) {
      setLoading(true);
    }

    const result = await adminFetch<Product[]>("/api/admin/products");
    if (result.status === 401 || result.error === "Unauthorized") {
      clearAdminToken();
      router.replace("/admin/login");
      return;
    }
    if (result.error) {
      toast.error(result.error);
    } else {
      setProducts(result.data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    const previous = products;
    setProducts((current) => current.filter((product) => product.id !== id));
    if (editing?.id === id) {
      setEditing(null);
    }

    const result = await adminFetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    if (result.error) {
      setProducts(previous);
      toast.error(result.error);
      return;
    }

    toast.success("Товар удалён");
  }

  return (
    <div className="mx-auto w-full max-w-[90rem] space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Товары</h1>
        <p className="text-muted-foreground">
          Управление каталогом и ценами
        </p>
      </div>

      <ProductForm
        editing={editing}
        onSuccess={() => {
          setEditing(null);
          void loadProducts();
        }}
        onCancel={() => setEditing(null)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Список товаров</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Загрузка...</p>
          ) : products.length === 0 ? (
            <p className="text-muted-foreground">Товаров пока нет.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border/70 p-4"
                  style={{
                    contentVisibility: "auto",
                    containIntrinsicSize: "0 140px",
                  }}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        width={64}
                        height={64}
                        loading="lazy"
                        decoding="async"
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted text-[10px] text-muted-foreground">
                        нет фото
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">
                        {product.name}
                        {!product.isActive ? (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">
                            неактивен
                          </span>
                        ) : null}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.grams > 0 ? `${product.grams} г` : "вес не указан"}
                        {" · "}
                        {product.category ?? "Без категории"} ·{" "}
                        {formatPrice(product.price)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {product.calories} ккал · Б {product.proteins} · Ж{" "}
                        {product.fats} · У {product.carbs}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditing(product)}
                    >
                      <Pencil className="h-4 w-4" />
                      Изменить
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
