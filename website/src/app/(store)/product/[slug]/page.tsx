import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongo";
import { Product } from "@/lib/models";
import { formatPKR } from "@/lib/utils";
import { SITE, waLink } from "@/lib/site";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const CAT_LABEL: Record<string, string> = {
  food: "Food",
  accessories: "Accessories",
  toys: "Toys",
  litter: "Litter",
  grooming: "Grooming",
  pharmacy: "Pharmacy",
};

async function getProduct(slug: string) {
  try {
    await connectDB();
    const doc = await Product.findOne({ slug }).lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const out = p.stock <= 0;
  const related = (await Product.find({ category: p.category, slug: { $ne: p.slug } })
    .limit(4)
    .lean()) as any[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-steel">
        <Link href="/shop" className="penlink">
          Shelves
        </Link>{" "}
        / {CAT_LABEL[p.category] ?? p.category} / {p.brand}
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="border-2 border-ink bg-white hardshadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
          </div>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-steel">
            Placeholder photography. The real pack looks better; visit the shop or ask on WhatsApp.
          </p>
        </div>

        <div>
          <h1 className="font-display text-4xl leading-tight">{p.name}</h1>
          <p className="mt-2 font-mono text-sm uppercase tracking-widest text-steel">
            {p.brand} / {p.unit}
          </p>

          <div className="mt-6 flex items-end gap-3">
            <p className="font-display text-4xl">{formatPKR(p.price)}</p>
            {p.oldPrice && p.oldPrice > p.price ? (
              <p className="font-mono text-lg text-steel line-through">{formatPKR(p.oldPrice)}</p>
            ) : null}
          </div>

          <div className="mt-6 cutline" />

          <dl className="mt-4 divide-y divide-ink/20 font-mono text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-steel uppercase tracking-widest">Shelf</dt>
              <dd className="font-bold uppercase">{CAT_LABEL[p.category] ?? p.category}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-steel uppercase tracking-widest">For</dt>
              <dd className="font-bold uppercase">{(p.petTypes ?? []).join(", ") || "all pets"}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-steel uppercase tracking-widest">In stock</dt>
              <dd className="font-bold">
                {out ? "0, order on call" : p.stock <= 3 ? `${p.stock}, going fast` : `${p.stock} units`}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-ink/80">{p.blurb}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AddToCart item={{ slug: p.slug, name: p.name, price: p.price, image: p.image, unit: p.unit }} withQty maxQty={out ? 0 : undefined} disabled={out} />
            <a
              href={waLink(`Assalam o alaikum. Is ${p.name} (${formatPKR(p.price)}) available?`)}
              className="border-2 border-ink bg-sage px-4 py-2 font-display text-sm text-paper hover:bg-sage-dark"
            >
              ASK ON WHATSAPP
            </a>
          </div>

          <div className="mt-8 border-2 border-ink bg-bone p-4 font-mono text-sm">
            <p className="font-bold uppercase">How you get it</p>
            <p className="mt-1 text-ink/80">
              Same-day delivery inside G-10 and nearby sectors, next day across Islamabad and
              Rawalpindi. Or pick it up at Ramna Plaza, we are open right now.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl">SAME SHELF</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.slug} p={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
