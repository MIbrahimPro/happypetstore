"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPKR } from "@/lib/utils";
import { SITE, waLink } from "@/lib/site";

export default function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);

  async function placeOrder() {
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone are needed so the rider finds you.");
      return;
    }
    if (!/^0?3\d{9}$/.test(phone.replace(/[\s-]/g, ""))) {
      setError("That phone number does not look right. Example: 03001234567");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          address,
          note,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place the order");
      const msg =
        `Assalam o alaikum! Order ${data.ref}\n` +
        items.map((i) => `• ${i.qty} x ${i.name} (${formatPKR(i.price * i.qty)})`).join("\n") +
        `\nTotal: ${formatPKR(total)}\n` +
        `Name: ${name}\nPhone: ${phone}` +
        (address ? `\nAddress: ${address}` : "") +
        (note ? `\nNote: ${note}` : "");
      setPlaced(true);
      clear();
      window.location.href = waLink(msg);
    } catch (e: any) {
      setError(e.message);
      setSending(false);
    }
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl">YOUR BASKET IS EMPTY</h1>
        <p className="mt-3 font-mono text-sm text-steel">
          The shelves are full though.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block border-2 border-ink bg-red px-6 py-3 font-display text-paper hardshadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          GO TO THE SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl sm:text-5xl">YOUR BASKET</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="border-2 border-ink bg-white">
            <div className="grid grid-cols-[1fr_auto] gap-2 border-b-2 border-ink bg-bone px-4 py-2 font-mono text-xs uppercase tracking-widest">
              <span>Item</span>
              <span>Qty / Price</span>
            </div>
            {items.map((i) => (
              <div key={i.slug} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-ink/20 px-4 py-3 last:border-b-0">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt={i.name} className="h-14 w-14 border border-ink object-cover" />
                  <div>
                    <Link href={`/product/${i.slug}`} className="font-display hover:text-red">
                      {i.name}
                    </Link>
                    <p className="font-mono text-xs text-steel">{i.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-ink">
                    <button onClick={() => setQty(i.slug, i.qty - 1)} className="px-2 py-1 font-mono hover:bg-ink hover:text-paper" aria-label="Decrease">
                      −
                    </button>
                    <span className="w-8 text-center font-mono text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.slug, i.qty + 1)} className="px-2 py-1 font-mono hover:bg-ink hover:text-paper" aria-label="Increase">
                      +
                    </button>
                  </div>
                  <p className="w-24 text-right font-display">{formatPKR(i.price * i.qty)}</p>
                  <button onClick={() => remove(i.slug)} className="font-mono text-xs uppercase text-steel hover:text-red" aria-label={`Remove ${i.name}`}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t-2 border-ink bg-bone px-4 py-3">
              <button onClick={clear} className="font-mono text-xs uppercase text-steel hover:text-red">
                Empty the basket
              </button>
              <p className="font-display text-2xl">TOTAL {formatPKR(total)}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="border-2 border-ink bg-white p-5 hardshadow">
            <h2 className="font-display text-2xl">DELIVERY DETAILS</h2>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-steel">
              This opens WhatsApp with your order typed out
            </p>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-widest">Your name *</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm outline-none focus:bg-mustard/20"
                  placeholder="Ibrahim"
                />
              </label>
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-widest">Phone *</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm outline-none focus:bg-mustard/20"
                  placeholder="03001234567"
                  inputMode="tel"
                />
              </label>
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-widest">Address for delivery</span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm outline-none focus:bg-mustard/20"
                  placeholder="House, street, sector"
                />
              </label>
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-widest">Note for the rider</span>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm outline-none focus:bg-mustard/20"
                  placeholder="Call on arrival, gate code, etc."
                />
              </label>
            </div>
            {error && (
              <p className="mt-3 border-2 border-red-dark bg-red/10 px-3 py-2 font-mono text-sm text-red-dark">
                {error}
              </p>
            )}
            <button
              onClick={placeOrder}
              disabled={sending}
              className="mt-5 w-full border-2 border-ink bg-sage-dark px-4 py-3 font-display text-paper hover:bg-ink disabled:opacity-60"
            >
              {sending ? "PLACING…" : "SEND ORDER ON WHATSAPP"}
            </button>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-steel">
              Cash on delivery. The shop confirms stock before dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
