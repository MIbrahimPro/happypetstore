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
      Product.find({ active: true }).sort({ createdAt: 1 }).limit(6).lean(),
      Lead.find({ kind: "adoption", status: "new" }).limit(3).lean(),
    ]);
    return { products: JSON.parse(JSON.stringify(products)), pets: JSON.parse(JSON.stringify(pets)) };
  } catch {
    return { products: [], pets: [] };
  }
}

export default async function HomePage() {
  const { products, pets } = await getData();
  const shelfCount = products.length;

  return (
    <div>
      {/* ------------------------------------------------ hero, fur + swiggle */}
      <section className="fur relative overflow-hidden">
        <div className="mx-auto flex min-h-[calc(100svh-130px)] max-w-6xl flex-col justify-center px-4 pb-16 pt-10 lg:pb-20 lg:pt-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h1 className="font-display text-5xl font-extrabold leading-[1.02] text-night sm:text-6xl">
                Soft paws.
                <br />
                <span className="relative inline-block">
                  Sharp care.
                  <Swiggle className="absolute -bottom-3 left-0 h-6 w-full" color="var(--amber)" />
                </span>
                <br />
                <span className="text-collar">Always open.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-night/75">
                Kittens and dogs under one roof, shelves full of food and toys, and a vet who
                answers at 3 a.m. Walk in any hour — the kettle is usually on.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/shop" className="btn-soft bg-collardeep text-bone shadow-soft hover:brightness-110">
                  Browse the shelves
                </Link>
                <a href={telLink()} className="btn-soft bg-night text-bone hover:bg-night/85">
                  Call {SITE.phone}
                </a>
                <a
                  href={waLink("Hello Happy Tails! I saw your website.")}
                  target="_blank"
                  rel="noreferrer"
                  className="warm-link font-round text-sm font-bold text-night/80"
                >
                  or WhatsApp us
                </a>
              </div>

              <p className="mt-5 font-round text-sm font-semibold text-night/80">
                Open 24/7 · Live stock on this site · Same-day delivery in G-10
              </p>
            </div>

            <div className="relative flex items-center justify-center py-4">
              <div className="fur-dark animate-breathe w-full max-w-[270px] rotate-1 rounded-blob p-5 shadow-soft sm:max-w-md sm:p-8">
                {/* the client's own logo art, background removed, on a night tile */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/logo-lockup.svg"
                  alt="Happy Tails: leaping dog over the script Tails wordmark"
                  className="w-full"
                />
              </div>
              <div className="absolute -right-1 top-2 rotate-3 rounded-full bg-amber px-3.5 py-1.5 font-round text-xs font-bold text-night shadow-soft sm:top-4">
                24/7, even on Eid
              </div>
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
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              {SITE.addressShort}. The signboard is the one with the leaping cat. Parking right
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
            <div className="relative mt-8 overflow-hidden rounded-[2rem] shadow-soft">
              <iframe
                src={SITE.mapEmbedPlain}
                width="100%"
                height="340"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Happy Tails Pet Store on Google Maps"
              />
              {/* our own address chip — round like everything else */}
              <a
                href={SITE.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="absolute left-3 top-3 flex max-w-[85%] items-center gap-2 rounded-full bg-bone/95 px-3.5 py-2 shadow-soft backdrop-blur transition-transform hover:scale-[1.02]"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-collar font-round text-[11px] font-bold text-white">
                  ↗
                </span>
                <span className="truncate font-round text-xs font-bold text-night">
                  {SITE.addressShort}
                </span>
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/cat-leap.svg"
              alt="The leaping cat from the shop signboard"
              className="mx-auto w-44 max-w-sm rotate-2 drop-shadow-[0_16px_24px_rgba(11,11,12,0.15)] sm:w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
