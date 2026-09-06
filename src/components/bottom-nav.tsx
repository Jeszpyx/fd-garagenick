"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartItemCount } from "@/store/cart";

const links = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/menu", label: "Меню", icon: CalendarDays },
  { href: "/cart", label: "Корзина", icon: ShoppingCart },
];

export function BottomNav() {
  const pathname = usePathname();
  const totalItems = useCartItemCount();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-[color-mix(in_oklch,var(--background)_92%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-3 px-2 py-1.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[11px] transition",
                active
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
              {href === "/cart" && totalItems > 0 ? (
                <span className="absolute right-2 top-1 flex h-4 min-w-4 items-center justify-center rounded-md bg-primary px-1 text-[10px] text-primary-foreground">
                  {totalItems}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
