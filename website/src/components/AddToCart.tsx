"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";

type Props = {
  item: { slug: string; name: string; price: number; image: string; unit: string };
  disabled?: boolean;
  withQty?: boolean;
  maxQty?: number;
};

export default function AddToCart({ item, disabled, withQty, maxQty }: Props) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  function handleAdd() {
    if (disabled) return;
    add(item, qty);
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  }

  return (
    <div className="flex items-center gap-2">
      {withQty && (
        <div className="flex items-center rounded-full bg-night/5">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="rounded-full px-2.5 py-1 font-round text-sm font-bold hover:bg-night hover:text-bone"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-7 text-center font-round text-sm font-bold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => (maxQty ? Math.min(maxQty, q + 1) : q + 1))}
            className="rounded-full px-2.5 py-1 font-round text-sm font-bold hover:bg-night hover:text-bone"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className={
          "btn-soft px-4 py-1.5 text-sm " +
          (disabled
            ? "cursor-not-allowed bg-night/10 text-smoke"
            : done
            ? "bg-turf text-bone"
            : "bg-amber text-night hover:brightness-105")
        }
      >
        {disabled ? "Call" : done ? "Added ✓" : "Add"}
      </button>
    </div>
  );
}
