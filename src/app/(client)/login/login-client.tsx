"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
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
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);

  const phone = normalizePhone(localPhone);
  const phoneReady = isBelarusMobile(phone);

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

      if (json.data?.devCode) {
        toast.message(`Dev OTP: ${json.data.devCode}`);
      }

      toast.success("Код отправлен");
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

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Вход по телефону РБ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                Код отправлен на {phone}
              </p>
              <div className="space-y-2">
                <Label htmlFor="code">Код из SMS</Label>
                <Input
                  id="code"
                  placeholder="1234"
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
