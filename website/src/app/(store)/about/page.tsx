import { SITE, telLink, waLink } from "@/lib/site";

export const metadata = { title: "Visit us in G-10" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            THE SIGN ON BELA ROAD
            <br />
            <span className="text-red">WITH THE LEAPING CAT.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/80">
            Happy Tails started as a weekend counter and turned into the shop that never locks.
            Families from G-10 and G-11 come for kittens and puppy food; riders on night duty
            come because the lights are always on and someone always answers.
          </p>
          <div className="mt-6 cutline max-w-xl" />
          <p className="mt-6 max-w-xl text-ink/80">
            Three counters, one roof. The store counter sells food, litter, accessories and
            toys. The clinic counter handles medicines, vaccines and the vet. The front window
            belongs to the animals: litters from verified local breeders, plus rescues the
            clinic nurses back and rehomes.
          </p>
        </div>
        <div className="sticker rotate-1 self-start">
          <div className="border-2 border-ink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/shop/storefront.jpg" alt="Happy Tails shopfront at night" className="h-72 w-full object-cover" />
          </div>
          <p className="py-2 text-center font-mono text-[11px] uppercase tracking-widest text-ink/70">
            Ramna Plaza after closing time everywhere else
          </p>
        </div>
      </div>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="border-2 border-ink bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-steel">Address</p>
          <p className="mt-2 font-display text-lg leading-snug">{SITE.address}</p>
        </div>
        <div className="border-2 border-ink bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-steel">Phone and WhatsApp</p>
          <a href={telLink()} className="penlink mt-2 inline-block font-display text-lg">
            {SITE.phone}
          </a>
          <p className="mt-1 font-mono text-xs text-steel">Same number on WhatsApp</p>
        </div>
        <div className="border-2 border-ink bg-white p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-steel">Hours</p>
          <p className="mt-2 font-display text-lg">Open 24 hours</p>
          <p className="mt-1 font-mono text-xs text-steel">Every day of the year</p>
        </div>
      </section>

      <section className="mt-10 border-2 border-ink hardshadow">
        <iframe
          src={SITE.mapEmbed}
          width="100%"
          height="420"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Map to Happy Tails Pet Store"
        />
      </section>

      <section className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="border-2 border-ink bg-bone p-6 font-mono text-sm">
          <p className="font-display text-xl uppercase">Getting here</p>
          <ul className="mt-3 space-y-2 text-ink/80">
            <li>• From G-10 Markaz roundabout, take Bela Road toward Ramna Plaza; we are plot 14-B.</li>
            <li>• Parking on the plaza front, the guard waves you in at any hour.</li>
            <li>• Careem and InDrive drop right at the gate; tell them Ramna Plaza, G-10 Markaz.</li>
          </ul>
        </div>
        <div className="border-2 border-ink bg-ink p-6 text-paper">
          <p className="font-display text-xl uppercase text-mustard">Before you drive over</p>
          <p className="mt-3 text-paper/85">
            If you are coming for a specific animal, medicine or food bag, a quick call saves
            the trip. We will confirm it is on the shelf and keep it with your name on it.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={telLink()} className="border-2 border-paper px-4 py-2 font-display text-sm text-paper hover:bg-paper hover:text-ink">
              CALL THE SHOP
            </a>
            <a href={waLink("Assalam o alaikum, quick question before I visit: ")} className="border-2 border-paper bg-paper px-4 py-2 font-display text-sm text-ink hover:bg-mustard">
              WHATSAPP US
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
