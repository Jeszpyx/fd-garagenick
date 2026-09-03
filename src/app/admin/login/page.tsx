"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setAdminToken } from "@/lib/api/admin-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function enterAdmin() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await response.json();

      if (!response.ok || !json.data?.token) {
        toast.error(json.error ?? "Не удалось войти");
        return;
      }

      setAdminToken(json.data.token);
      router.replace("/admin/products");
    } catch {
      toast.error("Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.replace("/admin/products");
      return;
    }

    void enterAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Админ-панель</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Пароль сейчас не требуется.
          </p>
          <Button className="w-full" disabled={loading} onClick={enterAdmin}>
            {loading ? "Вход..." : "Войти"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
