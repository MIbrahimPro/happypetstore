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
    <div className="fur min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="caption font-round text-xs uppercase">
          <Link href="/shop" className="warm-link">
            Shelves
          </Link>{" "}
          / {CAT_LABEL[p.category] ?? p.category} / {p.brand}
        </p>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-blob bg-white p-2.5 shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} className="aspect-square w-full rounded-[1.2rem] object-cover" />
            </div>
            <p className="caption mt-3 font-round text-[11px] uppercase">
              Placeholder photography. The real pack looks better; visit the shop or ask on WhatsApp.
            </p>
          </div>

          <div>
            <h1 className="font-display text-4xl font-extrabold leading-tight">{p.name}</h1>
            <p className="caption mt-2 font-round text-sm uppercase">
              {p.brand} / {p.unit}
            </p>

            <div className="mt-6 flex items-end gap-3">
              <p className="font-display text-4xl font-extrabold">{formatPKR(p.price)}</p>
              {p.oldPrice && p.oldPrice > p.price ? (
                <p className="font-round text-lg text-smoke line-through">{formatPKR(p.oldPrice)}</p>
              ) : null}
            </div>

            <dl className="mt-6 divide-y divide-night/10 rounded-2xl bg-white px-4 font-round text-sm shadow-softer">
              <div className="flex justify-between py-2.5">
                <dt className="caption text-xs uppercase">Shelf</dt>
                <dd className="font-bold uppercase">{CAT_LABEL[p.category] ?? p.category}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="caption text-xs uppercase">For</dt>
                <dd className="font-bold uppercase">{(p.petTypes ?? []).join(", ") || "all pets"}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="caption text-xs uppercase">In stock</dt>
                <dd className={"font-bold " + (out ? "text-collar" : p.stock <= 3 ? "text-amber" : "text-turf")}>
                  {out ? "0, order on call" : p.stock <= 3 ? `${p.stock}, going fast` : `${p.stock} units`}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-night/80">{p.blurb}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AddToCart item={{ slug: p.slug, name: p.name, price: p.price, image: p.image, unit: p.unit }} withQty maxQty={out ? 0 : undefined} disabled={out} />
              <a
                href={waLink(`Assalam o alaikum. Is ${p.name} (${formatPKR(p.price)}) available?`)}
                className="btn-soft bg-turf text-sm text-bone hover:brightness-110"
              >
                Ask on WhatsApp
              </a>
            </div>

            <div className="mt-8 rounded-2xl bg-night p-4 font-round text-sm text-bone">
              <p className="font-bold text-amber">How you get it</p>
              <p className="mt-1 text-bone/85">
                Same-day delivery inside G-10 and nearby sectors, next day across Islamabad and
                Rawalpindi. Or pick it up at Ramna Plaza, we are open right now.
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl font-bold">Same shelf</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.slug} p={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
