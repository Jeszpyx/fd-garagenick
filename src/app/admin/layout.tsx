"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Info,
  LayoutGrid,
  LogOut,
  Settings,
  Tags,
} from "lucide-react";
import { clearAdminToken, getAdminToken } from "@/lib/api/admin-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin/products", label: "Товары", icon: LayoutGrid },
  { href: "/admin/categories", label: "Категории", icon: Tags },
  { href: "/admin/menu", label: "Календарь", icon: CalendarDays },
  { href: "/admin/about", label: "О нас", icon: Info },
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
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getAdminToken()));
  }, [pathname]);

  function handleLogout() {
    clearAdminToken();
    setHasToken(false);
    router.push("/admin/login");
  }

  if (isLogin) {
    return <div className="min-h-dvh w-full">{children}</div>;
  }

  return (
    <div className="min-h-dvh w-full lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="border-b border-border bg-background lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r lg:p-5">
        <div className="flex items-center justify-between gap-3 p-3 lg:mb-8 lg:block lg:p-0">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Admin</p>
            <h1 className="truncate text-lg font-bold lg:text-xl">
              Кафе Василёк
            </h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={handleLogout}
            aria-label="Выйти"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <nav className="hide-scrollbar flex gap-2 overflow-x-auto px-3 pb-3 lg:block lg:flex-1 lg:space-y-2 lg:overflow-visible lg:px-0 lg:pb-0">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition lg:gap-3 lg:px-4 lg:py-3",
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
          className="mt-auto hidden w-full lg:inline-flex"
          onClick={handleLogout}
          disabled={!hasToken}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </aside>

      <main className="min-w-0 p-4 sm:p-6 lg:p-8 xl:p-10">{children}</main>
    </div>
  );
}
