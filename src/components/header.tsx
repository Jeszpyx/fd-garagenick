"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/menu", label: "Меню" },
];

export function Header() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems());
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition",
        isHome
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border/50 bg-[color-mix(in_oklch,var(--background)_88%,transparent)] backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 md:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "font-display text-xl font-semibold tracking-tight sm:text-2xl",
              isHome ? "text-white drop-shadow-sm" : "text-foreground",
            )}
          >
            GarageNick
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
                  "rounded-xl px-3 py-2 text-sm font-medium transition",
                  isHome
                    ? active
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    : active
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
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-xl transition",
              isHome
                ? "text-white hover:bg-white/15"
                : "hover:bg-accent",
            )}
          >
            <UserRound className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className={cn(
              "relative inline-flex h-10 items-center rounded-xl px-3 text-sm font-medium transition sm:h-11 sm:px-5",
              isHome
                ? "border border-white/35 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
                : "border border-border bg-card/70 hover:bg-accent",
            )}
          >
            <span>Корзина</span>
            {totalItems > 0 ? (
              <span
                className={cn(
                  "absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs",
                  isHome
                    ? "bg-white text-[oklch(0.35_0.08_155)]"
                    : "bg-primary text-primary-foreground",
                )}
              >
                {totalItems}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
