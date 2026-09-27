import Link from "next/link";
import { connectDB } from "@/lib/mongo";
import { Product } from "@/lib/models";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = { title: "Shop" };

const CATS = [
  { id: "food", label: "Food" },
  { id: "litter", label: "Litter" },
  { id: "accessories", label: "Accessories" },
  { id: "toys", label: "Toys" },
  { id: "grooming", label: "Grooming" },
  { id: "pharmacy", label: "Pharmacy" },
];

async function getProducts() {
  try {
    await connectDB();
    const docs = await Product.find({ active: true }).sort({ createdAt: 1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch {
    return [];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const cat = typeof params.cat === "string" ? params.cat : "all";
  const q = typeof params.q === "string" ? params.q : "";
  const products = await getProducts();

  const filtered = products.filter((p: any) => {
    const okCat = cat === "all" || p.category === cat;
    const okQ =
      !q ||
      [p.name, p.brand, p.blurb].join(" ").toLowerCase().includes(q.toLowerCase());
    return okCat && okQ;
  });

  return (
    <div className="fur min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">The shelves</h1>
            <p className="mt-2 max-w-lg text-night/75">
              Live stock counts — if something shows zero, call and it usually lands within a day.
            </p>
          </div>
          <form action="/shop" className="flex w-full items-center sm:w-auto">
            <div className="flex w-full min-w-0 items-center rounded-full border-2 border-night/10 bg-white pl-4 focus-within:border-amber">
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search food, leash, litter…"
                className="w-full min-w-0 bg-transparent py-2.5 font-round text-sm outline-none placeholder:text-ink"
              />
              <button
                className="m-1 inline-flex h-9 w-11 shrink-0 items-center justify-center rounded-full bg-night text-bone active:scale-95"
                aria-label="Search"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* category rail: swipeable on phones, wraps on desktop */}
        <div
          className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        >
          <Link
            href="/shop"
            className={`nav-pill shrink-0 px-4 py-2.5 font-round text-sm font-bold sm:py-2 ${
              cat === "all" ? "active" : ""
            }`}
          >
            All ({products.length})
          </Link>
          {CATS.map((c) => {
            const n = products.filter((p: any) => p.category === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/shop?cat=${c.id}`}
                className={`nav-pill shrink-0 px-4 py-2.5 font-round text-sm font-bold sm:py-2 ${
                  cat === c.id ? "active" : ""
                }`}
              >
                {c.label} ({n})
              </Link>
            );
          })}
        </div>
        <p className="mt-4 font-round text-xs font-semibold uppercase tracking-wider text-ink">
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
          {q ? ` matching “${q}”` : ""}
        </p>

        {filtered.length === 0 ? (
          <div className="softcard mt-10 p-10 text-center">
            <p className="font-display text-2xl font-bold">Nothing on this shelf yet</p>
            <p className="mt-2 font-round text-sm text-ink">
              Try another tab, or call 0313 1495287 and we will find it.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filtered.map((p: any) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
