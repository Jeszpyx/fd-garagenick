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
      <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:px-6 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
