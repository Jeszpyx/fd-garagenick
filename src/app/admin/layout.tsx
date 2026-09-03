"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, LayoutGrid, LogOut } from "lucide-react";
import { clearAdminToken, getAdminToken } from "@/lib/api/admin-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin/products", label: "Товары", icon: LayoutGrid },
  { href: "/admin/menu", label: "Календарь меню", icon: CalendarDays },
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
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-b border-border/60 bg-background/80 p-4 backdrop-blur-xl md:min-h-screen md:border-b-0 md:border-r">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Admin</p>
          <h1 className="text-xl font-bold">GarageNick</h1>
        </div>
        <nav className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
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
          className="mt-6 w-full"
          onClick={handleLogout}
          disabled={!getAdminToken()}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </aside>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
