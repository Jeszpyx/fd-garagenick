"use client";

import Link from "next/link";
import { ShoppingBag, UserRound } from "lucide-react";
import { useCartStore } from "@/store/cart";

export function Header() {
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">GarageNick</p>
            <p className="text-xs text-muted-foreground">Доставка еды</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            aria-label="Профиль"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-accent"
          >
            <UserRound className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex h-11 items-center rounded-xl border border-border bg-background/60 px-5 text-sm font-medium hover:bg-accent"
          >
            Корзина
            {totalItems > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                {totalItems}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
