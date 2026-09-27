"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  totalQty: number;
  total: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ht_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);

  const value = useMemo<CartCtx>(() => {
    return {
      items,
      totalQty: items.reduce((a, b) => a + b.qty, 0),
      total: items.reduce((a, b) => a + b.qty * b.price, 0),
      add: (item, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((p) => p.slug === item.slug);
          if (found) {
            return prev.map((p) => (p.slug === item.slug ? { ...p, qty: p.qty + qty } : p));
          }
          return [...prev, { ...item, qty }];
        }),
      setQty: (slug, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((p) => p.slug !== slug) : prev.map((p) => (p.slug === slug ? { ...p, qty } : p))
        ),
      remove: (slug) => setItems((prev) => prev.filter((p) => p.slug !== slug)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
