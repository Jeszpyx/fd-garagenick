import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { CartHydration } from "@/components/cart-hydration";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-theme flex min-h-dvh w-full min-w-0 flex-col">
      <CartHydration />
      <Header />
      <main className="site-page w-full min-w-0 flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:pb-12">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
