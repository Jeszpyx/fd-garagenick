"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/api/admin-client";
import type { Product } from "@/types";
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
  imageUrl: string;
  category: string;
  isActive: boolean;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "",
  isActive: true,
};

export function ProductForm({ editing, onSuccess, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description ?? "",
        price: String(editing.price),
        imageUrl: editing.imageUrl ?? "",
        category: editing.category ?? "",
        isActive: editing.isActive,
      });
      return;
    }

    setForm(emptyForm);
  }, [editing]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      imageUrl: form.imageUrl || null,
      category: form.category || null,
      isActive: form.isActive,
    };

    const result = editing
      ? await adminFetch(`/api/admin/products/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      : await adminFetch("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(editing ? "Товар обновлён" : "Товар создан");
    setForm(emptyForm);
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
            <Label htmlFor="price">Цена</Label>
            <Input
              id="price"
              type="number"
              min="1"
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <Input
              id="category"
              value={form.category}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, category: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL изображения</Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
              }
            />
          </div>
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
            <Label htmlFor="isActive">Активен в каталоге</Label>
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
