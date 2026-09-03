import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[calc(100dvh-3.5rem)] w-full min-w-0 max-w-6xl flex-1 px-4 pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-4 sm:px-5 sm:pt-6 md:px-6 md:pb-10">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
