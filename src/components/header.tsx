"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { useCartItemCount } from "@/store/cart";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/menu", label: "Меню" },
  { href: "/cart", label: "Корзина" },
];

export function Header() {
  const pathname = usePathname();
  const totalItems = useCartItemCount();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-[oklch(0.94_0.025_145)]/95 backdrop-blur-xl">
      <div className="site-shell flex h-14 items-center justify-between gap-3 sm:h-16">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <span className="truncate font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Кафе Василёк
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition lg:px-4",
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/login"
            aria-label="Профиль"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition hover:bg-accent"
          >
            <UserRound className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="relative hidden h-10 items-center rounded-xl border border-border bg-card/80 px-3 text-sm font-medium transition hover:bg-accent sm:inline-flex sm:h-11 sm:px-5"
          >
            <span>Корзина</span>
            {totalItems > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-md bg-primary px-1 text-xs text-primary-foreground">
                {totalItems}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
