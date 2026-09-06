"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ensureUserSession } from "@/lib/api/user-client";
import { MOCK_OTP_CODE } from "@/lib/auth/otp-constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatBelarusPhoneInput,
  getBelarusLocalDigits,
  isBelarusMobile,
  normalizePhone,
} from "@/lib/utils";

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [localPhone, setLocalPhone] = useState("");
  const [code, setCode] = useState(MOCK_OTP_CODE);
  const [name, setName] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const phone = normalizePhone(localPhone);
  const phoneReady = isBelarusMobile(phone);

  useEffect(() => {
    async function restoreSession() {
      const ok = await ensureUserSession();
      if (ok) {
        router.replace(redirect);
        return;
      }
      setCheckingSession(false);
    }

    void restoreSession();
  }, [redirect, router]);

  function handlePhoneChange(value: string) {
    setLocalPhone(getBelarusLocalDigits(value));
  }

  async function sendOtp() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error ?? "Не удалось отправить код");
        return;
      }

      const mockCode = json.data?.mockCode ?? MOCK_OTP_CODE;
      setCode(mockCode);
      toast.success(`Код (заглушка): ${mockCode}`);
      setStep("code");
    } catch {
      toast.error("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone,
          code,
          name: name.trim() || undefined,
        }),
      });
      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error ?? "Неверный код");
        return;
      }

      toast.success("Вы успешно вошли");
      router.push(redirect);
      router.refresh();
    } catch {
      toast.error("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="mx-auto max-w-md px-4 pt-6 sm:px-6">
        <Card className="site-surface border-0 shadow-none">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Проверяем сохранённый вход…
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-6 sm:px-6">
      <Card className="site-surface border-0 shadow-none">
        <CardHeader>
          <CardTitle className="font-display text-2xl font-semibold">
            Вход по телефону РБ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            SMS пока заглушка: код всегда <strong>{MOCK_OTP_CODE}</strong>.
            После входа сессия хранится (access + refresh), повторный SMS не
            нужен.
          </p>

          {step === "phone" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <div className="flex overflow-hidden rounded-xl border border-input bg-background/70 focus-within:ring-2 focus-within:ring-ring">
                  <span className="flex items-center bg-muted/70 px-3 text-sm font-medium text-muted-foreground">
                    +375
                  </span>
                  <Input
                    id="phone"
                    inputMode="tel"
                    placeholder="29 123-45-67"
                    value={formatBelarusPhoneInput(localPhone)}
                    onChange={(event) => handlePhoneChange(event.target.value)}
                    className="min-w-0 border-0 bg-transparent focus-visible:ring-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Мобильные операторы: 25, 29, 33, 44
                </p>
              </div>
              <Button
                className="w-full"
                disabled={loading || !phoneReady}
                onClick={sendOtp}
              >
                {loading ? "Отправка..." : "Получить код"}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Код для {phone}: <strong>{MOCK_OTP_CODE}</strong>
              </p>
              <div className="space-y-2">
                <Label htmlFor="code">Код из SMS</Label>
                <Input
                  id="code"
                  placeholder={MOCK_OTP_CODE}
                  maxLength={4}
                  inputMode="numeric"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Имя (необязательно)</Label>
                <Input
                  id="name"
                  placeholder="Как к вам обращаться"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <Button
                className="w-full"
                disabled={loading || code.length !== 4}
                onClick={verifyOtp}
              >
                {loading ? "Проверка..." : "Войти"}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setStep("phone")}
              >
                Изменить номер
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
