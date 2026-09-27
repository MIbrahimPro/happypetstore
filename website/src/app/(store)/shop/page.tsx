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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">THE SHELVES</h1>
          <p className="mt-2 max-w-lg text-ink/70">
            Live stock counts. If something shows zero, call us; it usually lands within a day.
          </p>
        </div>
        <form action="/shop" className="flex items-stretch">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search royal canin, leash, litter…"
            className="w-56 border-2 border-ink bg-white px-3 py-2 font-mono text-sm outline-none placeholder:text-steel/70 focus:bg-mustard/20"
          />
          <button className="border-2 border-l-0 border-ink bg-ink px-4 font-display text-sm text-paper hover:bg-red">
            FIND
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap gap-0 border-2 border-ink bg-white">
        <Link
          href="/shop"
          className={`border-r-2 border-ink px-4 py-2 font-mono text-sm uppercase ${
            cat === "all" ? "bg-ink text-paper" : "hover:bg-bone"
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
              className={`border-r-2 border-ink px-4 py-2 font-mono text-sm uppercase last:border-r-0 ${
                cat === c.id ? "bg-ink text-paper" : "hover:bg-bone"
              }`}
            >
              {c.label} ({n})
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 border-2 border-dashed border-ink p-10 text-center">
          <p className="font-display text-2xl">NOTHING ON THIS SHELF YET</p>
          <p className="mt-2 font-mono text-sm text-steel">
            Try another tab, or call {`0313 1495287`} and we will find it.
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
  );
}
