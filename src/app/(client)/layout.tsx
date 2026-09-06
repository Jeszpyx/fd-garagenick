import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-theme flex min-h-dvh flex-col">
      <Header />
      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
