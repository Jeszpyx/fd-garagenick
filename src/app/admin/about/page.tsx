"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { adminFetch, clearAdminToken } from "@/lib/api/admin-client";
import { compressImageFile } from "@/lib/compress-image";
import {
  MAX_ABOUT_PHOTOS,
  type AboutInfoData,
} from "@/lib/about-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormState = Omit<
  AboutInfoData,
  "hasCoverImage" | "coverImageUrl" | "photos" | "updatedAt"
>;

const emptyForm: FormState = {
  title: "",
  tagline: "",
  shortDescription: "",
  fullDescription: "",
  address: "",
  addressNote: "",
  city: "",
  postalCode: "",
  phone: "",
  phoneSecondary: "",
  email: "",
  whatsapp: "",
  telegram: "",
  instagram: "",
  vkontakte: "",
  hoursWeekdays: "",
  hoursWeekend: "",
  hoursNote: "",
  deliveryInfo: "",
  deliveryZones: "",
  minOrderNote: "",
  paymentMethods: "",
  parkingInfo: "",
  howToFind: "",
  mapUrl: "",
  legalName: "",
  unp: "",
  foundedYear: "",
  capacity: "",
  amenities: "",
};

function toForm(data: AboutInfoData): FormState {
  const { hasCoverImage, coverImageUrl, photos, updatedAt, ...rest } = data;
  void hasCoverImage;
  void coverImageUrl;
  void photos;
  void updatedAt;
  return rest;
}

export default function AdminAboutPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [photos, setPhotos] = useState<AboutInfoData["photos"]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function loadAbout() {
    const result = await adminFetch<AboutInfoData>("/api/admin/about");
    if (result.status === 401 || result.error === "Unauthorized") {
      clearAdminToken();
      router.replace("/admin/login");
      return;
    }
    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    if (result.data) {
      setForm(toForm(result.data));
      setPhotos(result.data.photos);
      setCoverPreview(result.data.coverImageUrl);
    }
    setCoverFile(null);
    setRemoveCover(false);
    setGalleryFiles([]);
    setLoading(false);
  }

  useEffect(() => {
    void loadAbout();
  }, []);

  useEffect(() => {
    if (!coverFile) return;
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    setRemoveCover(false);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  useEffect(() => {
    const urls = galleryFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(urls);
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, [galleryFiles]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const payload = new FormData();
    for (const [key, value] of Object.entries(form)) {
      payload.append(key, value);
    }

    if (coverFile) {
      try {
        payload.append("coverImage", await compressImageFile(coverFile));
      } catch {
        payload.append("coverImage", coverFile);
      }
    }
    if (removeCover) {
      payload.append("removeCover", "true");
    }

    for (const file of galleryFiles) {
      try {
        payload.append("galleryImages", await compressImageFile(file));
      } catch {
        payload.append("galleryImages", file);
      }
    }

    const result = await adminFetch<AboutInfoData>("/api/admin/about", {
      method: "PUT",
      body: payload,
    });

    setSaving(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.data) {
      setForm(toForm(result.data));
      setPhotos(result.data.photos);
      setCoverPreview(result.data.coverImageUrl);
    }
    setCoverFile(null);
    setRemoveCover(false);
    setGalleryFiles([]);
    toast.success("Раздел «О нас» сохранён");
  }

  async function handleDeletePhoto(id: string) {
    const result = await adminFetch<AboutInfoData>(
      `/api/admin/about/photos/${id}`,
      { method: "DELETE" },
    );
    if (result.error) {
      toast.error(result.error);
      return;
    }
    if (result.data) {
      setPhotos(result.data.photos);
    }
    toast.success("Фото удалено");
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
        Загрузка раздела «О нас»...
      </div>
    );
  }

  const remainingSlots = Math.max(0, MAX_ABOUT_PHOTOS - photos.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">О нас</h1>
        <p className="text-muted-foreground">
          Контакты, график, описание и фото. На сайт пока не выводится.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Основное</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Название" htmlFor="title">
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Кафе Василёк"
              />
            </Field>
            <Field label="Слоган" htmlFor="tagline">
              <Input
                id="tagline"
                value={form.tagline}
                onChange={(e) => setField("tagline", e.target.value)}
                placeholder="Домашняя еда каждый день"
              />
            </Field>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="shortDescription">Краткое описание</Label>
              <Textarea
                id="shortDescription"
                rows={3}
                value={form.shortDescription}
                onChange={(e) => setField("shortDescription", e.target.value)}
                placeholder="Короткий текст для превью"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullDescription">Полное описание</Label>
              <Textarea
                id="fullDescription"
                rows={6}
                value={form.fullDescription}
                onChange={(e) => setField("fullDescription", e.target.value)}
                placeholder="История, кухня, атмосфера..."
              />
            </div>
            <Field label="Год основания" htmlFor="foundedYear">
              <Input
                id="foundedYear"
                value={form.foundedYear}
                onChange={(e) => setField("foundedYear", e.target.value)}
                placeholder="2015"
              />
            </Field>
            <Field label="Вместимость (мест)" htmlFor="capacity">
              <Input
                id="capacity"
                value={form.capacity}
                onChange={(e) => setField("capacity", e.target.value)}
                placeholder="40"
              />
            </Field>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="amenities">Особенности / удобства</Label>
              <Textarea
                id="amenities"
                rows={3}
                value={form.amenities}
                onChange={(e) => setField("amenities", e.target.value)}
                placeholder="Wi‑Fi, детский уголок, безнал..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Адрес</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Город" htmlFor="city">
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
              />
            </Field>
            <Field label="Индекс" htmlFor="postalCode">
              <Input
                id="postalCode"
                value={form.postalCode}
                onChange={(e) => setField("postalCode", e.target.value)}
              />
            </Field>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="ул. Примерная, 10"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="addressNote">Ориентир</Label>
              <Input
                id="addressNote"
                value={form.addressNote}
                onChange={(e) => setField("addressNote", e.target.value)}
                placeholder="Рядом с рынком, вход со двора"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="howToFind">Как добраться</Label>
              <Textarea
                id="howToFind"
                rows={3}
                value={form.howToFind}
                onChange={(e) => setField("howToFind", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="parkingInfo">Парковка</Label>
              <Textarea
                id="parkingInfo"
                rows={2}
                value={form.parkingInfo}
                onChange={(e) => setField("parkingInfo", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="mapUrl">Ссылка на карту</Label>
              <Input
                id="mapUrl"
                value={form.mapUrl}
                onChange={(e) => setField("mapUrl", e.target.value)}
                placeholder="https://yandex.by/maps/..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Контакты</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Телефон" htmlFor="phone">
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+375 29 123-45-67"
              />
            </Field>
            <Field label="Доп. телефон" htmlFor="phoneSecondary">
              <Input
                id="phoneSecondary"
                value={form.phoneSecondary}
                onChange={(e) => setField("phoneSecondary", e.target.value)}
              />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </Field>
            <Field label="WhatsApp" htmlFor="whatsapp">
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => setField("whatsapp", e.target.value)}
                placeholder="+375..."
              />
            </Field>
            <Field label="Telegram" htmlFor="telegram">
              <Input
                id="telegram"
                value={form.telegram}
                onChange={(e) => setField("telegram", e.target.value)}
                placeholder="@cafe или ссылка"
              />
            </Field>
            <Field label="Instagram" htmlFor="instagram">
              <Input
                id="instagram"
                value={form.instagram}
                onChange={(e) => setField("instagram", e.target.value)}
              />
            </Field>
            <Field label="ВКонтакте" htmlFor="vkontakte">
              <Input
                id="vkontakte"
                value={form.vkontakte}
                onChange={(e) => setField("vkontakte", e.target.value)}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>График работы</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Будни" htmlFor="hoursWeekdays">
              <Input
                id="hoursWeekdays"
                value={form.hoursWeekdays}
                onChange={(e) => setField("hoursWeekdays", e.target.value)}
                placeholder="Пн–Пт: 9:00–21:00"
              />
            </Field>
            <Field label="Выходные" htmlFor="hoursWeekend">
              <Input
                id="hoursWeekend"
                value={form.hoursWeekend}
                onChange={(e) => setField("hoursWeekend", e.target.value)}
                placeholder="Сб–Вс: 10:00–20:00"
              />
            </Field>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="hoursNote">Примечание к графику</Label>
              <Textarea
                id="hoursNote"
                rows={2}
                value={form.hoursNote}
                onChange={(e) => setField("hoursNote", e.target.value)}
                placeholder="В праздники — по отдельному расписанию"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Доставка и оплата</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryInfo">Условия доставки</Label>
              <Textarea
                id="deliveryInfo"
                rows={3}
                value={form.deliveryInfo}
                onChange={(e) => setField("deliveryInfo", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryZones">Зоны доставки</Label>
              <Textarea
                id="deliveryZones"
                rows={3}
                value={form.deliveryZones}
                onChange={(e) => setField("deliveryZones", e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minOrderNote">Мин. заказ / примечание</Label>
                <Textarea
                  id="minOrderNote"
                  rows={2}
                  value={form.minOrderNote}
                  onChange={(e) => setField("minOrderNote", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethods">Способы оплаты</Label>
                <Textarea
                  id="paymentMethods"
                  rows={2}
                  value={form.paymentMethods}
                  onChange={(e) => setField("paymentMethods", e.target.value)}
                  placeholder="Наличные, карта, ЕРИП..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Реквизиты</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="legalName">Юридическое название</Label>
              <Input
                id="legalName"
                value={form.legalName}
                onChange={(e) => setField("legalName", e.target.value)}
              />
            </div>
            <Field label="УНП" htmlFor="unp">
              <Input
                id="unp"
                value={form.unp}
                onChange={(e) => setField("unp", e.target.value)}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Обложка</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {coverPreview && !removeCover ? (
              <div className="overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPreview}
                  alt="Обложка"
                  className="max-h-64 w-full object-cover"
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Обложка не задана</p>
            )}
            <div className="flex flex-wrap gap-3">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setCoverFile(file);
                  if (file) setRemoveCover(false);
                }}
              />
              {(coverPreview || coverFile) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCoverFile(null);
                    setCoverPreview(null);
                    setRemoveCover(true);
                  }}
                >
                  Удалить обложку
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Галерея</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              До {MAX_ABOUT_PHOTOS} фото. Сейчас: {photos.length}, можно
              добавить ещё {remainingSlots}.
            </p>

            {photos.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-xl border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || "Фото"}
                      className="h-40 w-full object-cover"
                    />
                    <div className="flex items-center justify-between gap-2 p-2">
                      <span className="truncate text-xs text-muted-foreground">
                        {photo.caption || "Без подписи"}
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        aria-label="Удалить фото"
                        onClick={() => void handleDeletePhoto(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {galleryPreviews.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {galleryPreviews.map((url) => (
                  <div
                    key={url}
                    className="overflow-hidden rounded-xl border border-dashed border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="Новое фото"
                      className="h-40 w-full object-cover"
                    />
                    <p className="p-2 text-xs text-muted-foreground">
                      Будет загружено при сохранении
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              disabled={remainingSlots === 0}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                const allowed = files.slice(0, remainingSlots);
                if (files.length > remainingSlots) {
                  toast.error(
                    `Можно добавить ещё только ${remainingSlots} фото`,
                  );
                }
                setGalleryFiles(allowed);
              }}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving} size="lg">
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
