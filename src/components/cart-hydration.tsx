"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

/** Подтягивает корзину из localStorage после гидратации — без mismatch SSR. */
export function CartHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
}
