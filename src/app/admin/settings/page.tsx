"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminFetch, clearAdminToken } from "@/lib/api/admin-client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SettingsResponse = {
  adminEmails: string[];
  telegramChatIds: string[];
  updatedAt: string | null;
  providers: {
    telegramConfigured: boolean;
    smtpConfigured: boolean;
  };
};

function listToText(values: string[]) {
  return values.join("\n");
}

function textToList(value: string) {
  return value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [emailsText, setEmailsText] = useState("");
  const [telegramText, setTelegramText] = useState("");
  const [providers, setProviders] = useState({
    telegramConfigured: false,
    smtpConfigured: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadSettings() {
    const result = await adminFetch<SettingsResponse>("/api/admin/settings");
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

    setEmailsText(listToText(result.data?.adminEmails ?? []));
    setTelegramText(listToText(result.data?.telegramChatIds ?? []));
    setProviders(
      result.data?.providers ?? {
        telegramConfigured: false,
        smtpConfigured: false,
      },
    );
    setLoading(false);
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const result = await adminFetch<SettingsResponse>("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify({
        adminEmails: textToList(emailsText),
        telegramChatIds: textToList(telegramText),
      }),
    });

    setSaving(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setEmailsText(listToText(result.data?.adminEmails ?? []));
    setTelegramText(listToText(result.data?.telegramChatIds ?? []));
    setProviders(
      result.data?.providers ?? {
        telegramConfigured: false,
        smtpConfigured: false,
      },
    );
    toast.success("Настройки сохранены");
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
        Загрузка настроек...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Настройки</h1>
        <p className="text-muted-foreground">
          Кому слать уведомления о новых заказах. Токен бота и SMTP — только в
          .env
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium">Telegram бот</p>
            <p
              className={
                providers.telegramConfigured
                  ? "mt-1 text-sm text-emerald-700"
                  : "mt-1 text-sm text-amber-700"
              }
            >
              {providers.telegramConfigured
                ? "TELEGRAM_BOT_TOKEN задан"
                : "Нет TELEGRAM_BOT_TOKEN в окружении"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium">Email (SMTP)</p>
            <p
              className={
                providers.smtpConfigured
                  ? "mt-1 text-sm text-emerald-700"
                  : "mt-1 text-sm text-amber-700"
              }
            >
              {providers.smtpConfigured
                ? "SMTP_HOST / USER / PASS заданы"
                : "SMTP в .env не настроен"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Получатели</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSave}>
            <div className="space-y-2">
              <Label htmlFor="emails">Email админов</Label>
              <Textarea
                id="emails"
                rows={5}
                placeholder={"admin@example.com\nchef@example.com"}
                value={emailsText}
                onChange={(event) => setEmailsText(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                По одному на строку (или через запятую)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram chat ID админов</Label>
              <Textarea
                id="telegram"
                rows={5}
                placeholder={"123456789\n-1001234567890"}
                value={telegramText}
                onChange={(event) => setTelegramText(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Числовой ID пользователя или группы. Узнать можно у @userinfobot
                после старта вашего бота.
              </p>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
