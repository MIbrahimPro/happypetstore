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
        <div className="flex items-center border-2 border-ink">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-2.5 py-1 font-mono text-sm hover:bg-ink hover:text-paper"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center font-mono text-sm">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => (maxQty ? Math.min(maxQty, q + 1) : q + 1))}
            className="px-2.5 py-1 font-mono text-sm hover:bg-ink hover:text-paper"
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
          "border-2 border-ink px-3 py-1.5 font-display text-sm uppercase tracking-wide " +
          (disabled
            ? "cursor-not-allowed bg-bone text-steel"
            : done
            ? "bg-sage-dark text-paper"
            : "bg-mustard hover:bg-ink hover:text-paper")
        }
      >
        {disabled ? "Call" : done ? "Added ✓" : "Add"}
      </button>
    </div>
  );
}
