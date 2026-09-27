import Link from "next/link";
import { connectDB } from "@/lib/mongo";
import { Product, Lead } from "@/lib/models";
import { SITE, telLink, waLink } from "@/lib/site";
import ProductCard from "@/components/ProductCard";
import SlideGrid from "@/components/SlideGrid";
import Swiggle from "@/components/Swiggle";

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
  ["Kittens and dogs", "Meet them in person before you decide. Vaccine cards included."],
  ["Food and accessories", "Bags from 1.5 to 13 kg, litters, leashes, carriers, bowls, beds."],
  ["Toys", "Ropes, balls, teasers, chews. Cheap enough to lose under the sofa."],
  ["Clinic counter", "Dewormers, spot-ons, sprays, supplements, and a vet on call 24/7."],
  ["Delivery", "Inside G-10 same day. Rest of Islamabad and Rawalpindi, next day."],
];

export default async function HomePage() {
  const { products, pets } = await getData();

  return (
    <div>
      {/* ------------------------------------------------ hero, fur + swiggle */}
      <section className="fur relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-16">
          <div>
            <p className="caption font-round text-xs uppercase">
              Pet store and clinic, G-10 Markaz
            </p>
            <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.02] text-night sm:text-6xl">
              Soft paws.
              <br />
              <span className="relative inline-block">
                Sharp care.
                <Swiggle className="absolute -bottom-3 left-0 h-6 w-full" color="var(--amber)" />
              </span>
              <br />
              <span className="text-collar">Always open.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg text-night/75">
              Kittens and dogs under one roof, shelves full of food and toys, and a vet who
              answers at 3 a.m. Wiggle your mouse, the line wags for you.
            </p>

            <ul className="mt-7 space-y-1 font-round text-sm">
              {TICKS.map(([head, sub]) => (
                <li key={head} className="flex gap-2.5 py-1.5">
                  <span className="mt-0.5 text-turf" aria-hidden="true">
                    <PawIcon />
                  </span>
                  <span>
                    <span className="font-bold">{head}</span>
                    <span className="text-night/65"> · {sub}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-soft bg-collar text-bone shadow-soft hover:bg-collardeep">
                Browse the shelves
              </Link>
              <a href={telLink()} className="btn-soft bg-night text-bone hover:bg-night/85">
                Call {SITE.phone}
              </a>
              <a
                href={waLink("Hello Happy Tails! I saw your website.")}
                target="_blank"
                rel="noreferrer"
                className="btn-soft bg-turf text-bone hover:brightness-110"
              >
                WhatsApp us
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="animate-breathe">
              {/* the client's own logo art, background removed */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-lockup.svg"
                alt="Happy Tails: leaping dog over the script Tails wordmark"
                className="w-full max-w-md rotate-1 drop-shadow-[0_18px_28px_rgba(11,11,12,0.18)]"
              />
            </div>
            <div className="absolute -right-1 top-2 rotate-3 rounded-full bg-amber px-3.5 py-1.5 font-round text-xs font-bold text-night shadow-soft">
              24/7, even on Eid
            </div>
            <div className="absolute bottom-3 left-2 -rotate-2 rounded-full bg-white px-3 py-1 font-round text-[11px] font-semibold text-night/70 shadow-softer">
              Est. G-10 Markaz
            </div>
          </div>
        </div>
        {/* leaping cat, night on bone, padding the fur */}
        <div className="pointer-events-none absolute -left-6 bottom-2 w-28 opacity-[0.07] sm:w-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/cat-silhouette.svg" alt="" className="w-full" />
        </div>
      </section>

      {/* ------------------------------------------ two doors, night fur band */}
      <section className="fur-dark text-bone">
        <div className="mx-auto grid max-w-6xl md:grid-cols-2">
          <a href={telLink()} className="group border-b border-bone/15 p-8 md:border-b-0 md:border-r md:p-10">
            <p className="caption font-round text-xs uppercase text-amber">Door 1</p>
            <h2 className="mt-2 font-display text-3xl font-bold group-hover:text-amber">The store</h2>
            <p className="mt-3 max-w-sm text-bone/75">
              Bags, cans, litter, leashes, toys. Stock on this site is live; when it says two
              left, it means two left.
            </p>
            <p className="mt-4 font-round font-bold text-amber">
              Shop the shelves
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </p>
          </a>
          <Link href="/clinic" className="group p-8 md:p-10">
            <p className="caption font-round text-xs uppercase text-amber">Door 2</p>
            <h2 className="mt-2 font-display text-3xl font-bold group-hover:text-amber">The clinic</h2>
            <p className="mt-3 max-w-sm text-bone/75">
              A vet on call around the clock. Vaccines, deworming, grooming advice, and
              emergency triage over the phone before you drive over.
            </p>
            <p className="mt-4 font-round font-bold text-amber">
              Clinic hours and visits
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </p>
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------ on the counter now */}
      <section className="fur mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            On the counter now
            <Swiggle className="mt-1 h-4 w-44" color="var(--turf)" strokeWidth={5} />
          </h2>
          <Link href="/shop" className="warm-link font-round text-sm font-bold text-night/80">
            All products
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p: any) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- adopt strip */}
      <section className="border-y border-night/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Come meet
                <br />
                the litters.
              </h2>
              <p className="mt-4 max-w-sm text-night/75">
                Persians, up-country tabbies, Labs, Shepherds and the occasional rescued desi
                pup. They are not listed online with prices; you visit, you hold one, you know.
              </p>
              <Link
                href="/adopt"
                className="btn-soft mt-6 bg-night text-bone hover:bg-night/85"
              >
                Meet them at the shop
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

      {/* ------------------------------------------------------- visit block */}
      <section className="fur mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Ramna Plaza, G-10 Markaz.</h2>
            <p className="mt-4 max-w-md text-night/75">
              {SITE.address}. The signboard is the one with the leaping cat. Parking right
              outside, milk shop next door.
            </p>
            <div className="mt-6 font-round text-sm">
              <p className="caption text-xs uppercase">Hours</p>
              <p className="font-bold">{SITE.hours}</p>
              <p className="caption mt-3 text-xs uppercase">Phone</p>
              <a href={telLink()} className="warm-link font-bold">
                {SITE.phone}
              </a>
            </div>
            <div className="mt-8 overflow-hidden rounded-blob shadow-soft">
              <iframe
                src={SITE.mapEmbed}
                width="100%"
                height="360"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Happy Tails Pet Store on Google Maps"
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/cat-leap.svg"
              alt="The leaping cat from the shop signboard"
              className="w-full max-w-sm rotate-2 drop-shadow-[0_16px_24px_rgba(11,11,12,0.15)]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <ellipse cx="9" cy="8" rx="1.7" ry="2.3" transform="rotate(-14 9 8)" />
      <ellipse cx="13.2" cy="7" rx="1.7" ry="2.4" transform="rotate(8 13.2 7)" />
      <ellipse cx="16.9" cy="9.6" rx="1.6" ry="2.2" transform="rotate(24 16.9 9.6)" />
      <path d="M12.4 11c-2.6 0-5.4 2.2-5.4 4.6 0 1.5 1.1 2.4 2.5 2.4 1 0 1.8-.4 2.9-.4s1.9.4 2.9.4c1.4 0 2.5-.9 2.5-2.4 0-2.4-2.8-4.6-5.4-4.6z" />
    </svg>
  );
}
