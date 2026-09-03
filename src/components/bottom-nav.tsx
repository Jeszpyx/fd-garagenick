"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, LayoutGrid, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

const links = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/menu", label: "Меню", icon: CalendarDays },
  { href: "/catalog", label: "Каталог", icon: LayoutGrid },
  { href: "/cart", label: "Корзина", icon: ShoppingCart },
];

export function BottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4 px-2 py-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs transition",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
              {href === "/cart" && totalItems > 0 ? (
                <span className="absolute right-3 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
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
