"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, LayoutGrid, LogOut, Settings, Tags } from "lucide-react";
import { clearAdminToken, getAdminToken } from "@/lib/api/admin-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin/products", label: "Товары", icon: LayoutGrid },
  { href: "/admin/categories", label: "Категории", icon: Tags },
  { href: "/admin/menu", label: "Календарь", icon: CalendarDays },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  function handleLogout() {
    clearAdminToken();
    router.push("/admin/login");
  }

  if (isLogin) {
    return <div className="min-h-dvh">{children}</div>;
  }

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-border/60 bg-background/80 p-3 backdrop-blur-xl md:min-h-dvh md:border-b-0 md:border-r md:p-4">
        <div className="mb-3 flex items-center justify-between gap-3 md:mb-8 md:block">
          <div>
            <p className="text-xs text-muted-foreground md:text-sm">Admin</p>
            <h1 className="text-lg font-bold md:text-xl">Кафе Василёк</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={handleLogout}
            aria-label="Выйти"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex gap-2 overflow-x-auto md:block md:space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition md:gap-3 md:px-4 md:py-3",
                pathname.startsWith(href)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <Button
          variant="outline"
          className="mt-6 hidden w-full md:inline-flex"
          onClick={handleLogout}
          disabled={!getAdminToken()}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </aside>
      <main className="min-w-0 p-3 sm:p-4 md:p-8">{children}</main>
    </div>
  );
}
