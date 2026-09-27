import { SITE, telLink, waLink } from "@/lib/site";
import LeadForm from "@/components/LeadForm";

export const metadata = { title: "The 24/7 clinic" };

const SERVICES: [string, string, string][] = [
  ["Vaccines", "Kitten and puppy courses, boosters, rabies", "Rs 1,500 to 3,500 per shot"],
  ["Deworming", "Every 3 months, dosed by weight", "Rs 500 to 1,200"],
  ["Tick and flea plan", "Spot-on course plus a house checklist", "Rs 1,400 per month"],
  ["Grooming wash", "Medicated bath for skin cases", "Rs 1,000 to 2,500"],
  ["Minor injuries", "Cuts, abscesses, torn nails, hot spots", "from Rs 1,000"],
  ["Emergency triage", "Poisoning, bloat, heatstroke, accidents", "Drop everything, come now"],
];

export default function ClinicPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            A VET WHO PICKS UP
            <br />
            <span className="text-red">AT 3 A.M.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/80">
            The clinic sits behind the shop counter. Day hours are for planned visits, vaccines
            and grooming. The night belongs to emergencies: call first so the vet meets you at
            the door with the table ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={telLink()}
              className="border-2 border-ink bg-red px-6 py-3 font-display text-paper hardshadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              CALL {SITE.phone}
            </a>
            <a
              href={waLink("Assalam o alaikum, I need the vet. ")}
              className="border-2 border-ink bg-sage px-6 py-3 font-display text-paper hover:bg-sage-dark"
            >
              WHATSAPP THE VET
            </a>
          </div>

          <div className="mt-10 border-2 border-ink bg-white">
            <p className="border-b-2 border-ink bg-bone px-4 py-2 font-mono text-xs uppercase tracking-widest">
              Call immediately if
            </p>
            <ul className="divide-y divide-ink/15 font-mono text-sm">
              {[
                "Your pet ate chocolate, onion, grapes, or anything from the bin",
                "A tick fever test is due and the gums look pale",
                "Vomiting more than twice, or blood in it",
                "The belly is tight and heaving but nothing comes out",
                "Hit by a car, even if it walked it off",
                "Kitten or puppy refusing food for over 12 hours",
              ].map((t) => (
                <li key={t} className="flex gap-3 px-4 py-2.5">
                  <span className="text-red">!</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="border-2 border-ink bg-ink p-6 text-paper hardshadow-red">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-mustard">Opening hours</p>
            <p className="mt-3 font-display text-4xl">24 / 7</p>
            <p className="mt-2 font-mono text-sm text-paper/80">
              Planned visits any time. Emergencies skip the queue, always.
            </p>
            <div className="mt-4 cutline opacity-60" />
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-paper/70">
              Walk in: {SITE.addressShort}
            </p>
          </div>
          <div className="sticker -rotate-1 mt-6">
            <div className="border-2 border-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/shop/clinic-counter.jpg" alt="Clinic counter" className="h-56 w-full object-cover" />
            </div>
            <p className="py-2 text-center font-mono text-[11px] uppercase tracking-widest text-ink/70">
              The clinic counter, stocked like a pharmacy
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl">WHAT IT COSTS</h2>
        <p className="mt-2 font-mono text-sm text-steel">
          Honest bands, not hidden quotes. Exact price depends on weight and case.
        </p>
        <div className="mt-6 border-2 border-ink bg-white">
          <div className="hidden grid-cols-[1fr_1.4fr_0.8fr] gap-2 border-b-2 border-ink bg-bone px-4 py-2 font-mono text-xs uppercase tracking-widest sm:grid">
            <span>Service</span>
            <span>Covers</span>
            <span className="text-right">Band</span>
          </div>
          {SERVICES.map(([s, c, p]) => (
            <div key={s} className="grid gap-1 border-b border-ink/15 px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_1.4fr_0.8fr] sm:gap-2">
              <p className="font-display">{s}</p>
              <p className="text-sm text-ink/70">{c}</p>
              <p className="font-mono text-sm font-bold sm:text-right">{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <div className="border-2 border-ink bg-bone p-6">
          <h2 className="font-display text-2xl">BOOK A VISIT</h2>
          <p className="mt-2 text-sm text-ink/75">
            Write what is going on and when you want to come. For emergencies skip this form
            and call; the phone is answered faster.
          </p>
          <div className="mt-5">
            <LeadForm kind="vet" />
          </div>
        </div>
        <div className="border-2 border-dashed border-ink p-6 font-mono text-sm">
          <p className="font-display text-xl">HOUSE CALLS</p>
          <p className="mt-2 text-ink/75">
            Inside G-10 and G-11 the vet comes to you for vaccines and follow-ups, mostly in the
            quieter hours. Ask on the phone; the fee depends on where you live and the time.
          </p>
          <div className="mt-4 cutline" />
          <p className="mt-4 text-ink/75">
            Pharmacy shelf is public: dewormers, spot-ons, calcium, wound sprays. Show us the
            pet or a photo and we will hand you the right one, not the expensive one.
          </p>
        </div>
      </section>
    </div>
  );
}
