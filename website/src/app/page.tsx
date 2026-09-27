import Link from "next/link";
import { connectDB } from "@/lib/mongo";
import { Product, Lead } from "@/lib/models";
import { SITE, waLink, telLink } from "@/lib/site";
import ProductCard from "@/components/ProductCard";
import SlideGrid from "@/components/SlideGrid";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    await connectDB();
    const [products, pets] = await Promise.all([
      Product.find({ active: true }).sort({ createdAt: 1 }).limit(8).lean(),
      Lead.find({ kind: "adoption", status: "new" }).limit(3).lean(),
    ]);
    return { products: JSON.parse(JSON.stringify(products)), pets: JSON.parse(JSON.stringify(pets)) };
  } catch {
    return { products: [], pets: [] };
  }
}

const TICKS = [
  ["Kittens and dogs", "See them in person before you decide. Prices include vaccine cards."],
  ["Food and accessories", "Bags from 1.5 to 13 kg, litters, leashes, carriers, bowls, beds."],
  ["Toys", "Ropes, balls, teasers, chews. Cheap enough to lose under the sofa."],
  ["Clinic counter", "Dewormers, spot-ons, sprays, supplements, and a vet on call 24/7."],
  ["Delivery", "Inside G-10 and nearby sectors, same day. Rest of Islamabad and Rawalpindi, next day."],
];

export default async function HomePage() {
  const { products, pets } = await getData();

  return (
    <div>
      {/* Hero: no gradient, no floating shapes. Photo pinned inside a ruled frame. */}
      <section className="graph border-b-2 border-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">
              Pet store and clinic
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              THE SHOP THAT
              <br />
              <span className="text-red">NEVER</span> CLOSES.
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink/80">
              Kittens and dogs under one roof with food, accessories, toys and a vet counter
              that answers at 3 a.m. G-10 Markaz, Islamabad.
            </p>

            <div className="mt-8 cutline max-w-md" />

            <ul className="mt-6 space-y-0 font-mono text-sm">
              {TICKS.map(([head, sub]) => (
                <li key={head} className="flex gap-3 border-b border-dashed border-ink/40 py-2.5">
                  <span className="text-red">✓</span>
                  <span>
                    <span className="font-bold uppercase">{head}</span>
                    <span className="text-ink/70"> — {sub}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="border-2 border-ink bg-red px-6 py-3 font-display text-paper hardshadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                BROWSE THE SHELVES
              </Link>
              <a
                href={telLink()}
                className="border-2 border-ink bg-paper px-6 py-3 font-display hardshadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                CALL {SITE.phone}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="sticker rotate-1">
              <div className="border-2 border-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/shop/hero-shelf.jpg"
                  alt="Shelves stocked with pet food and accessories at the shop"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-5 left-6 -rotate-2 border-2 border-ink bg-mustard px-3 py-1.5 font-display text-sm hardshadow">
              24/7, even on Eid
            </div>
            <div className="absolute -top-4 right-4 rotate-3 border-2 border-ink bg-paper px-2 py-1 font-mono text-[11px] uppercase tracking-widest hardshadow">
              Est. G-10 Markaz
            </div>
          </div>
        </div>
      </section>

      {/* Two doors: shop vs clinic */}
      <section className="border-b-2 border-ink bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl md:grid-cols-2">
          <a href={telLink()} className="group border-b-2 border-paper/20 p-8 md:border-b-0 md:border-r-2 md:p-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-mustard">Door 1</p>
            <h2 className="mt-3 font-display text-3xl group-hover:text-mustard">THE STORE</h2>
            <p className="mt-3 max-w-sm text-paper/80">
              Bags, cans, litter, leashes, toys. Stock is live on this site; when it says two
              left, it means two left.
            </p>
            <p className="mt-4 font-display text-mustard">SHOP THE SHELVES →</p>
          </a>
          <Link href="/clinic" className="group p-8 md:p-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-mustard">Door 2</p>
            <h2 className="mt-3 font-display text-3xl group-hover:text-mustard">THE CLINIC</h2>
            <p className="mt-3 max-w-sm text-paper/80">
              A vet on call around the clock. Vaccines, deworming, grooming advice, and
              emergency triage over the phone before you drive over.
            </p>
            <p className="mt-4 font-display text-mustard">CLINIC HOURS AND VISITS →</p>
          </Link>
        </div>
      </section>

      {/* On the counter now: catalogue rows */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl sm:text-4xl">ON THE COUNTER NOW</h2>
          <Link href="/shop" className="penlink font-mono text-sm uppercase">
            All products
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p: any) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* Adopt strip */}
      <section className="border-y-2 border-ink bg-bone">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">
                COME MEET
                <br />
                THE LITTERS.
              </h2>
              <p className="mt-4 max-w-sm text-ink/80">
                Persians, up-country tabbies, Labs, Shepherds and the occasional rescued desi
                pup. They are not listed online with prices; you visit, you hold one, you know.
              </p>
              <Link
                href="/adopt"
                className="mt-6 inline-block border-2 border-ink bg-paper px-5 py-2.5 font-display hardshadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                MEET THEM AT THE SHOP
              </Link>
            </div>
            <SlideGrid
              images={pets.map((p: any) => ({
                src: p.img || "/images/pets/kitten-1.jpg",
                label: p.name,
              }))}
            />
          </div>
        </div>
      </section>

      {/* Visit block with map embed */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">RAMNA PLAZA, G-10 MARKAZ.</h2>
            <p className="mt-4 max-w-md text-ink/80">
              {SITE.address}. The signboard is the one with the leaping cat. Parking right
              outside, milk shop next door.
            </p>
            <div className="mt-6 font-mono text-sm">
              <p className="text-steel">HOURS</p>
              <p className="font-bold">{SITE.hours}</p>
              <p className="mt-3 text-steel">PHONE</p>
              <a href={telLink()} className="penlink font-bold">
                {SITE.phone}
              </a>
            </div>
          </div>
          <div className="border-2 border-ink hardshadow">
            <iframe
              src={SITE.mapEmbed}
              width="100%"
              height="380"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Happy Tails Pet Store on Google Maps"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
