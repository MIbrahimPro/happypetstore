"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartButton() {
  const { totalQty } = useCart();
  return (
    <Link
      href="/cart"
      className="flex items-center gap-2 border-l-2 border-ink bg-red px-3 font-display text-sm text-paper hover:bg-red-dark sm:px-4"
    >
      CART
      <span className="inline-flex h-5 min-w-[20px] items-center justify-center border border-paper px-1 font-mono text-xs">
        {totalQty}
      </span>
    </Link>
  );
}
