"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="site-shell flex min-h-[70dvh] items-center justify-center py-8 sm:py-12">
      <div className="site-surface w-full max-w-lg rounded-3xl p-6 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12 text-primary sm:h-20 sm:w-20">
          <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
          Заказ оформлен
        </h1>
        <p className="mt-2 text-muted-foreground sm:text-base">
          {orderId
            ? `Номер заказа: ${orderId}`
            : "Мы уже начали готовить ваш заказ."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:mt-8">
          <Button
            className="w-full"
            size="lg"
            onClick={() => window.location.assign("/")}
          >
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
