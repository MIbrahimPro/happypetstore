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
            <p className="mt-2 max-w-lg text-night/70">
              Live stock counts. If something shows zero, call us; it usually lands within a day.
            </p>
          </div>
          <form action="/shop" className="flex items-center gap-2">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search royal canin, leash, litter…"
              className="w-56 rounded-full border-2 border-night/10 bg-white px-4 py-2.5 font-round text-sm outline-none placeholder:text-smoke/70 focus:border-amber"
            />
            <button className="btn-soft bg-night px-5 py-2.5 text-sm text-bone hover:bg-night/85">
              Find
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`rounded-full px-4 py-2 font-round text-sm font-bold transition-colors ${
              cat === "all" ? "bg-night text-bone" : "bg-white text-night/75 hover:bg-night/10 shadow-softer"
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
                className={`rounded-full px-4 py-2 font-round text-sm font-bold transition-colors ${
                  cat === c.id ? "bg-night text-bone" : "bg-white text-night/75 hover:bg-night/10 shadow-softer"
                }`}
              >
                {c.label} ({n})
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="softcard mt-10 p-10 text-center">
            <p className="font-display text-2xl font-bold">Nothing on this shelf yet</p>
            <p className="mt-2 font-round text-sm text-smoke">
              Try another tab, or call 0313 1495287 and we will find it.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p: any) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
