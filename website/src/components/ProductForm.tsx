"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["food", "litter", "accessories", "toys", "grooming", "pharmacy"];
const PETS = ["dog", "cat", "bird", "small-pet"];

export type ProductFormValues = {
  _id?: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  petTypes: string[];
  price: number;
  oldPrice?: number | null;
  unit: string;
  stock: number;
  lowStockAt: number;
  image: string;
  blurb: string;
  active: boolean;
};

export default function ProductForm({ initial }: { initial: ProductFormValues }) {
  const router = useRouter();
  const [v, setV] = useState<ProductFormValues>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      set("image", data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const url = v._id ? `/api/admin/products/${v._id}` : "/api/admin/products";
      const res = await fetch(url, {
        method: v._id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4 font-mono text-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs uppercase tracking-widest text-paper/60">Name *</span>
          <input
            value={v.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-1 w-full border-2 border-paper/40 bg-transparent px-3 py-2 text-paper outline-none focus:border-paper"
            required
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-paper/60">Shelf (category) *</span>
          <select
            value={v.category}
            onChange={(e) => set("category", e.target.value)}
            className="mt-1 w-full border-2 border-paper/40 bg-[#141311] px-3 py-2 text-paper outline-none focus:border-paper"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-paper/60">Brand</span>
          <input
            value={v.brand}
            onChange={(e) => set("brand", e.target.value)}
            className="mt-1 w-full border-2 border-paper/40 bg-transparent px-3 py-2 text-paper outline-none focus:border-paper"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-paper/60">Price (PKR) *</span>
          <input
            type="number"
            min={0}
            value={v.price}
            onChange={(e) => set("price", Number(e.target.value))}
            className="mt-1 w-full border-2 border-paper/40 bg-transparent px-3 py-2 text-paper outline-none focus:border-paper"
            required
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-paper/60">Old price (for strike-through)</span>
          <input
            type="number"
            min={0}
            value={v.oldPrice ?? ""}
            onChange={(e) => set("oldPrice", e.target.value ? Number(e.target.value) : null)}
            className="mt-1 w-full border-2 border-paper/40 bg-transparent px-3 py-2 text-paper outline-none focus:border-paper"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-paper/60">Unit label</span>
          <input
            value={v.unit}
            onChange={(e) => set("unit", e.target.value)}
            placeholder="2 kg bag"
            className="mt-1 w-full border-2 border-paper/40 bg-transparent px-3 py-2 text-paper outline-none focus:border-paper"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-paper/60">Slug (URL, leave blank to auto)</span>
          <input
            value={v.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="mt-1 w-full border-2 border-paper/40 bg-transparent px-3 py-2 text-paper outline-none focus:border-paper"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs uppercase tracking-widest text-paper/60">One line about it</span>
          <input
            value={v.blurb}
            onChange={(e) => set("blurb", e.target.value)}
            className="mt-1 w-full border-2 border-paper/40 bg-transparent px-3 py-2 text-paper outline-none focus:border-paper"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-paper/60">Stock on shelf *</span>
          <input
            type="number"
            min={0}
            value={v.stock}
            onChange={(e) => set("stock", Number(e.target.value))}
            className="mt-1 w-full border-2 border-paper/40 bg-transparent px-3 py-2 text-paper outline-none focus:border-paper"
            required
          />
          <span className="mt-1 block text-[11px] text-paper/40">
            Changes here are logged as a stock movement. Prefer the Stock desk for daily changes.
          </span>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-paper/60">Low stock alert at</span>
          <input
            type="number"
            min={0}
            value={v.lowStockAt}
            onChange={(e) => set("lowStockAt", Number(e.target.value))}
            className="mt-1 w-full border-2 border-paper/40 bg-transparent px-3 py-2 text-paper outline-none focus:border-paper"
          />
        </label>
      </div>

      <fieldset>
        <legend className="text-xs uppercase tracking-widest text-paper/60">For which pets</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {PETS.map((pet) => (
            <label key={pet} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={v.petTypes.includes(pet)}
                onChange={(e) =>
                  set(
                    "petTypes",
                    e.target.checked ? [...v.petTypes, pet] : v.petTypes.filter((x) => x !== pet)
                  )
                }
              />
              {pet}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="border-2 border-paper/30 p-4">
        <span className="text-xs uppercase tracking-widest text-paper/60">Photo</span>
        <div className="mt-2 flex items-center gap-4">
          {v.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={v.image} alt="" className="h-20 w-20 border-2 border-paper/40 object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center border-2 border-dashed border-paper/40 text-paper/40">
              none
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
              className="text-paper/80"
            />
            {uploading && <p className="mt-1 text-mustard">Uploading to Cloudinary…</p>}
            <input
              value={v.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="or paste an image URL"
              className="mt-2 w-full border-2 border-paper/40 bg-transparent px-3 py-2 text-paper outline-none focus:border-paper"
            />
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={v.active}
          onChange={(e) => set("active", e.target.checked)}
        />
        <span className="text-xs uppercase tracking-widest text-paper/60">Visible on the site</span>
      </label>

      {error && <p className="border-2 border-red px-3 py-2 text-red">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="border-2 border-paper bg-red px-6 py-2.5 font-display text-paper hover:bg-red-dark disabled:opacity-60"
        >
          {busy ? "SAVING…" : "SAVE PRODUCT"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="border-2 border-paper/40 px-6 py-2.5 font-display hover:bg-paper/10"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
