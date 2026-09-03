import { Suspense } from "react";
import LoginPageClient from "./login-client";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center">Загрузка...</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
