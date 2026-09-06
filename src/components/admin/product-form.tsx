"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/api/admin-client";
import { compressImageFile } from "@/lib/compress-image";
import type { Category, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProductFormProps = {
  editing: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  name: string;
  description: string;
  price: string;
  calories: string;
  proteins: string;
  fats: string;
  carbs: string;
  categoryId: string;
  isActive: boolean;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  calories: "",
  proteins: "",
  fats: "",
  carbs: "",
  categoryId: "",
  isActive: true,
};

export function ProductForm({ editing, onSuccess, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadCategories() {
    const result = await adminFetch<Category[]>("/api/admin/categories");
    if (!result.error) {
      setCategories(result.data ?? []);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description ?? "",
        price: String(editing.price),
        calories: String(editing.calories ?? 0),
        proteins: String(editing.proteins ?? 0),
        fats: String(editing.fats ?? 0),
        carbs: String(editing.carbs ?? 0),
        categoryId: editing.categoryId ?? "",
        isActive: editing.isActive,
      });
      setPreview(editing.imageUrl);
      setFile(null);
      setRemoveImage(false);
      return;
    }

    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    setRemoveImage(false);
  }, [editing]);

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setRemoveImage(false);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("description", form.description);
    payload.append("price", form.price);
    payload.append("calories", form.calories);
    payload.append("proteins", form.proteins);
    payload.append("fats", form.fats);
    payload.append("carbs", form.carbs);
    payload.append("categoryId", form.categoryId);
    payload.append("isActive", String(form.isActive));
    if (file) {
      try {
        payload.append("image", await compressImageFile(file));
      } catch {
        payload.append("image", file);
      }
    }
    if (removeImage) {
      payload.append("removeImage", "true");
    }

    const result = editing
      ? await adminFetch(`/api/admin/products/${editing.id}`, {
          method: "PUT",
          body: payload,
        })
      : await adminFetch("/api/admin/products", {
          method: "POST",
          body: payload,
        });

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(editing ? "Товар обновлён" : "Товар создан");
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    setRemoveImage(false);
    onSuccess();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editing ? "Редактировать товар" : "Добавить товар"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Цена, BYN</Label>
            <Input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, price: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories">Калории, ккал</Label>
            <Input
              id="calories"
              type="number"
              min="0"
              step="1"
              value={form.calories}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, calories: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proteins">Белки, г</Label>
            <Input
              id="proteins"
              type="number"
              min="0"
              step="0.1"
              value={form.proteins}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, proteins: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fats">Жиры, г</Label>
            <Input
              id="fats"
              type="number"
              min="0"
              step="0.1"
              value={form.fats}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fats: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carbs">Углеводы, г</Label>
            <Input
              id="carbs"
              type="number"
              min="0"
              step="0.1"
              value={form.carbs}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, carbs: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Категория</Label>
            <select
              id="categoryId"
              value={form.categoryId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, categoryId: event.target.value }))
              }
              className="flex h-10 w-full rounded-xl border border-input bg-background/70 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Категории создаются в разделе «Категории»
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Фото блюда</Label>
            <Input
              id="image"
              type="file"
              className="max-w-full file:mr-3"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP или GIF, до 5 МБ</p>
          </div>
          {preview && !removeImage ? (
            <div className="space-y-2 md:col-span-2">
              <img
                src={preview}
                alt="Превью"
                className="h-36 w-36 rounded-2xl object-cover sm:h-40 sm:w-40"
              />
              {editing?.imageUrl && !file ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRemoveImage(true);
                    setPreview(null);
                  }}
                >
                  Удалить фото
                </Button>
              ) : null}
            </div>
          ) : null}
          <div className="flex items-center gap-2 md:col-span-2">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  isActive: event.target.checked,
                }))
              }
            />
            <Label htmlFor="isActive">Активен в меню</Label>
          </div>
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Сохранение..." : editing ? "Сохранить" : "Создать"}
            </Button>
            {editing ? (
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
