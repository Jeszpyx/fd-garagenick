"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="mx-auto max-w-lg px-4 pt-8 sm:px-6">
      <div className="site-surface rounded-3xl p-6 text-center sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold">Заказ оформлен</h1>
        <p className="mt-2 text-muted-foreground">
          {orderId
            ? `Номер заказа: ${orderId}`
            : "Мы уже начали готовить ваш заказ."}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button className="w-full" onClick={() => window.location.assign("/")}>
            На главную
          </Button>
          <Link href="/menu" className="text-sm font-medium text-primary">
            Посмотреть меню
          </Link>
        </div>
      </div>
    </div>
  );
}
