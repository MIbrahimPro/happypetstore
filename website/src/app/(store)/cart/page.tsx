"use client";
import { asset } from "@/lib/base";
import { BASE } from "@/lib/base";

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
      const res = await fetch(BASE + "/api/orders", {
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
      <div className="fur min-h-[60vh]">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-display text-4xl font-extrabold">Your basket is empty</h1>
          <p className="mt-3 font-round text-sm text-ink">The shelves are full though.</p>
          <Link href="/shop" className="btn-soft mt-8 bg-collardeep text-bone shadow-soft hover:brightness-110">
            Go to the shop
          </Link>
        </div>
      </div>
    );
  }

  const field =
    "mt-1 w-full rounded-2xl border-2 border-night/10 bg-white px-3.5 py-2.5 font-round text-sm outline-none transition-colors focus:border-amber";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Your basket</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="softcard overflow-hidden">
          <div className="grid grid-cols-[1fr_auto] gap-2 bg-night px-4 py-2.5 font-round text-xs font-bold uppercase tracking-widest text-amber">
            <span>Item</span>
            <span>Qty / Price</span>
          </div>
          {items.map((i) => (
            <div key={i.slug} className="border-b border-night/10 px-4 py-3 last:border-b-0">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(i.image)} alt={i.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${i.slug}`} className="block truncate font-round font-bold leading-snug hover:text-turfdeep">
                    {i.name}
                  </Link>
                  <p className="font-round text-xs text-ink">{i.unit}</p>
                </div>
                <p className="whitespace-nowrap text-right font-round font-bold">{formatPKR(i.price * i.qty)}</p>
                <button
                  onClick={() => remove(i.slug)}
                  className="shrink-0 rounded-full p-1.5 font-round text-sm font-bold text-ink hover:bg-night/5 hover:text-collar"
                  aria-label={`Remove ${i.name}`}
                >
                  ✕
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between pl-[68px]">
                <div className="flex items-center rounded-full bg-night/5">
                  <button onClick={() => setQty(i.slug, i.qty - 1)} className="rounded-full px-3 py-1.5 font-round font-bold hover:bg-night hover:text-bone" aria-label="Decrease">
                    −
                  </button>
                  <span className="w-7 text-center font-round text-sm font-bold">{i.qty}</span>
                  <button onClick={() => setQty(i.slug, i.qty + 1)} className="rounded-full px-3 py-1.5 font-round font-bold hover:bg-night hover:text-bone" aria-label="Increase">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between bg-white/60 px-4 py-3">
            <button onClick={clear} className="font-round text-xs font-bold uppercase text-ink hover:text-collar">
              Empty the basket
            </button>
            <p className="font-display text-2xl font-extrabold">
              Total {formatPKR(total)}
            </p>
          </div>
        </div>

        <div>
          <div className="rounded-blob bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-bold">Delivery details</h2>
            <p className="caption mt-1 font-round text-xs uppercase">
              This opens WhatsApp with your order typed out
            </p>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="caption font-round text-xs uppercase">Your name *</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="Ibrahim" />
              </label>
              <label className="block">
                <span className="caption font-round text-xs uppercase">Phone *</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={field}
                  placeholder="03001234567"
                  inputMode="tel"
                />
              </label>
              <label className="block">
                <span className="caption font-round text-xs uppercase">Address for delivery</span>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className={field} placeholder="House, street, sector" />
              </label>
              <label className="block">
                <span className="caption font-round text-xs uppercase">Note for the rider</span>
                <input value={note} onChange={(e) => setNote(e.target.value)} className={field} placeholder="Call on arrival, gate code, etc." />
              </label>
            </div>
            {error && (
              <p className="mt-3 rounded-2xl bg-collar/10 px-3.5 py-2.5 font-round text-sm font-semibold text-collardeep">
                {error}
              </p>
            )}
            <button
              onClick={placeOrder}
              disabled={sending}
              className="btn-soft mt-5 w-full justify-center bg-turfdeep text-bone hover:brightness-110 disabled:opacity-60"
            >
              {sending ? "Placing…" : "Send order on WhatsApp"}
            </button>
            <p className="caption mt-3 font-round text-[11px] uppercase">
              Cash on delivery. The shop confirms stock before dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
