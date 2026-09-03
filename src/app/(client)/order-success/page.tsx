import { Suspense } from "react";
import OrderSuccessClient from "./order-success-client";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center">Загрузка...</div>}>
      <OrderSuccessClient />
    </Suspense>
  );
}
