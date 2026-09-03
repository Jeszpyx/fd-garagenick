"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="mx-auto max-w-lg">
      <Card className="p-8 text-center">
        <CardContent className="space-y-4 p-0">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Заказ оформлен</h1>
          <p className="text-muted-foreground">
            {orderId
              ? `Номер заказа: ${orderId}`
              : "Мы уже начали готовить ваш заказ."}
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <Button onClick={() => window.location.assign("/")}>
              На главную
            </Button>
            <Link href="/menu" className="text-sm text-primary">
              Посмотреть меню
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
