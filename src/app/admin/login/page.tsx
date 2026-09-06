"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ensureAdminSession } from "@/lib/api/admin-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  async function enterAdmin() {
    setLoading(true);

    try {
      const token = await ensureAdminSession();
      if (!token) {
        toast.error("Не удалось войти");
        return;
      }

      router.replace("/admin/products");
    } catch {
      toast.error("Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void enterAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Админ-панель</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Пароль сейчас не требуется. Получаем доступ…
          </p>
          <Button className="w-full" disabled={loading} onClick={enterAdmin}>
            {loading ? "Вход..." : "Войти"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
