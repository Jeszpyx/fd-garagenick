"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminFetch, clearAdminToken } from "@/lib/api/admin-client";
import type { Category } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    const result = await adminFetch<Category[]>("/api/admin/categories");
    if (result.status === 401 || result.error === "Unauthorized") {
      clearAdminToken();
      router.replace("/admin/login");
      return;
    }
    if (result.error) {
      toast.error(result.error);
    } else {
      setCategories(result.data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      toast.error("Введите название категории");
      return;
    }

    if (
      categories.some(
        (category) => category.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      toast.error("Категория с таким названием уже есть");
      return;
    }

    setSaving(true);
    const result = await adminFetch<Category>("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name: trimmed }),
    });
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Категория создана");
    setName("");
    void loadCategories();
  }

  async function handleDelete(id: string, categoryName: string) {
    const confirmed = window.confirm(
      `Удалить категорию «${categoryName}»?\n\nВсе товары этой категории станут неактивными: они перестанут показываться в меню на сайте и в календаре админки. Сами товары не удаляются — их можно снова активировать в разделе «Товары».`,
    );
    if (!confirmed) {
      return;
    }

    const previous = categories;
    setCategories((current) => current.filter((item) => item.id !== id));

    const result = await adminFetch<{
      success: boolean;
      deactivatedProducts: number;
    }>(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });

    if (result.error) {
      setCategories(previous);
      toast.error(result.error);
      return;
    }

    const count = result.data?.deactivatedProducts ?? 0;
    toast.success(
      count > 0
        ? `Категория удалена, товаров деактивировано: ${count}`
        : "Категория удалена",
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Категории</h1>
        <p className="text-muted-foreground">
          Создайте список категорий и выбирайте их при добавлении товаров
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Новая категория</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleCreate}>
            <div className="flex-1 space-y-2">
              <Label htmlFor="category-name">Название</Label>
              <Input
                id="category-name"
                placeholder="Супы, Салаты, Горячее…"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <Button className="sm:mt-7" type="submit" disabled={saving}>
              {saving ? "Сохранение..." : "Добавить"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          Загрузка...
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          Категорий пока нет — добавьте первую.
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <p className="font-medium">{category.name}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => void handleDelete(category.id, category.name)}
                  aria-label="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
