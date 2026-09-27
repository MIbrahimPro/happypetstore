"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartButton() {
  const { totalQty } = useCart();
  return (
    <Link
      href="/cart"
      className="btn-soft relative bg-amber text-sm text-night shadow-softer hover:brightness-105"
      aria-label={`Cart, ${totalQty} items`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <ellipse cx="9" cy="8" rx="1.7" ry="2.3" transform="rotate(-14 9 8)" />
        <ellipse cx="13.2" cy="7" rx="1.7" ry="2.4" transform="rotate(8 13.2 7)" />
        <ellipse cx="16.9" cy="9.6" rx="1.6" ry="2.2" transform="rotate(24 16.9 9.6)" />
        <path d="M12.4 11c-2.6 0-5.4 2.2-5.4 4.6 0 1.5 1.1 2.4 2.5 2.4 1 0 1.8-.4 2.9-.4s1.9.4 2.9.4c1.4 0 2.5-.9 2.5-2.4 0-2.4-2.8-4.6-5.4-4.6z" />
      </svg>
      Cart
      {totalQty > 0 && (
        <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-collar px-1 font-round text-[11px] font-bold text-bone">
          {totalQty}
        </span>
      )}
    </Link>
  );
}
