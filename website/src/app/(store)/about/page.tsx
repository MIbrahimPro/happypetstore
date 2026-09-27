import { SITE, telLink, waLink } from "@/lib/site";

export const metadata = { title: "Visit us in G-10" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            The sign on Bela Road with the leaping cat.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-night/75">
            Happy Tails started as a weekend counter and turned into the shop that never locks.
            Families from G-10 and G-11 come for kittens and puppy food; riders on night duty
            come because the lights are always on and someone always answers.
          </p>
          <p className="mt-5 max-w-xl text-night/75">
            Three counters, one roof. The store counter sells food, litter, accessories and
            toys. The clinic counter handles medicines, vaccines and the vet. The front window
            belongs to the animals: litters from verified local breeders, plus rescues the
            clinic nurses back and rehomes.
          </p>
        </div>
        <div className="animate-sway rotate-1 self-start overflow-hidden rounded-blob bg-white p-2.5 shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/shop/storefront.jpg" alt="Happy Tails shopfront at night" className="h-72 w-full rounded-[1.2rem] object-cover" />
          <p className="caption py-2 text-center font-round text-[11px] uppercase">
            Ramna Plaza after closing time everywhere else
          </p>
        </div>
      </div>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="softcard p-5">
          <p className="caption font-round text-xs uppercase">Address</p>
          <p className="mt-2 font-round text-lg font-bold leading-snug">{SITE.address}</p>
        </div>
        <div className="softcard p-5">
          <p className="caption font-round text-xs uppercase">Phone and WhatsApp</p>
          <a href={telLink()} className="warm-link mt-2 inline-block font-round text-lg font-bold">
            {SITE.phone}
          </a>
          <p className="mt-1 font-round text-xs text-ink">Same number on WhatsApp</p>
        </div>
        <div className="softcard p-5">
          <p className="caption font-round text-xs uppercase">Hours</p>
          <p className="mt-2 font-round text-lg font-bold">Open 24 hours</p>
          <p className="mt-1 font-round text-xs text-ink">Every day of the year</p>
        </div>
      </section>

      <section className="relative mt-10 overflow-hidden rounded-[2rem] shadow-soft">
        <iframe
          src={SITE.mapEmbedPlain}
          width="100%"
          height="420"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Map to Happy Tails Pet Store"
        />
        <a
          href={SITE.mapsLink}
          target="_blank"
          rel="noreferrer"
          className="absolute left-4 top-4 flex max-w-[85%] items-center gap-2 rounded-full bg-bone/95 px-3.5 py-2 shadow-soft backdrop-blur transition-transform hover:scale-[1.02]"
        >
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-collar font-round text-[11px] font-bold text-white">
            ↗
          </span>
          <span className="truncate font-round text-xs font-bold text-night">
            {SITE.addressShort}
          </span>
        </a>
      </section>

      <section className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="rounded-blob border-2 border-dashed border-night/20 p-6 font-round text-sm">
          <p className="font-display text-xl font-bold">Getting here</p>
          <ul className="mt-3 space-y-2 text-night/75">
            <li>• From G-10 Markaz roundabout, take Bela Road toward Ramna Plaza; we are plot 14-B.</li>
            <li>• Parking on the plaza front, the guard waves you in at any hour.</li>
            <li>• Careem and InDrive drop right at the gate; tell them Ramna Plaza, G-10 Markaz.</li>
          </ul>
        </div>
        <div className="fur-dark rounded-blob p-6 text-bone">
          <p className="font-display text-xl font-bold text-amber">Before you drive over</p>
          <p className="mt-3 text-bone/85">
            If you are coming for a specific animal, medicine or food bag, a quick call saves
            the trip. We will confirm it is on the shelf and keep it with your name on it.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={telLink()} className="btn-soft bg-bone text-sm text-night hover:bg-white">
              Call the shop
            </a>
            <a
              href={waLink("Assalam o alaikum, quick question before I visit: ")}
              className="btn-soft bg-turfdeep text-sm text-bone hover:brightness-110"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
