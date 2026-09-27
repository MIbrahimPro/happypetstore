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
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            A vet who picks up
            <br />
            <span className="text-collar">at 3 a.m.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-night/75">
            The clinic sits behind the shop counter. Day hours are for planned visits, vaccines
            and grooming. The night belongs to emergencies: call first so the vet meets you at
            the door with the table ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={telLink()} className="btn-soft bg-collar text-bone shadow-soft hover:bg-collardeep">
              Call {SITE.phone}
            </a>
            <a
              href={waLink("Assalam o alaikum, I need the vet. ")}
              className="btn-soft bg-turf text-bone hover:brightness-110"
            >
              WhatsApp the vet
            </a>
          </div>

          <div className="softcard mt-10 overflow-hidden">
            <p className="bg-night px-4 py-2.5 font-round text-xs font-bold uppercase tracking-widest text-amber">
              Call immediately if
            </p>
            <ul className="divide-y divide-night/10 font-round text-sm">
              {[
                "Your pet ate chocolate, onion, grapes, or anything from the bin",
                "A tick fever test is due and the gums look pale",
                "Vomiting more than twice, or blood in it",
                "The belly is tight and heaving but nothing comes out",
                "Hit by a car, even if it walked it off",
                "Kitten or puppy refusing food for over 12 hours",
              ].map((t) => (
                <li key={t} className="flex gap-3 px-4 py-2.5">
                  <span className="font-bold text-collar">!</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="fur-dark rounded-blob p-6 text-bone shadow-soft">
            <p className="caption font-round text-xs uppercase text-amber">Opening hours</p>
            <p className="mt-3 font-display text-5xl font-extrabold">24 / 7</p>
            <p className="mt-2 font-round text-sm text-bone/75">
              Planned visits any time. Emergencies skip the queue, always.
            </p>
            <p className="caption mt-5 font-round text-xs uppercase text-bone/60">
              Walk in: {SITE.addressShort}
            </p>
          </div>
          <div className="-rotate-1 mt-6 overflow-hidden rounded-blob bg-white p-2.5 shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/shop/clinic-counter.jpg" alt="Clinic counter" className="h-56 w-full rounded-[1.2rem] object-cover" />
            <p className="caption py-2 text-center font-round text-[11px] uppercase">
              The clinic counter, stocked like a pharmacy
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold">What it costs</h2>
        <p className="mt-2 font-round text-sm text-smoke">
          Honest bands, not hidden quotes. Exact price depends on weight and case.
        </p>
        <div className="softcard mt-6 overflow-hidden">
          <div className="hidden grid-cols-[1fr_1.4fr_0.8fr] gap-2 bg-white/60 px-4 py-2.5 font-round text-xs font-bold uppercase tracking-widest text-smoke sm:grid">
            <span>Service</span>
            <span>Covers</span>
            <span className="text-right">Band</span>
          </div>
          {SERVICES.map(([s, c, p]) => (
            <div key={s} className="grid gap-1 border-t border-night/10 px-4 py-3 sm:grid-cols-[1fr_1.4fr_0.8fr] sm:gap-2">
              <p className="font-round font-bold">{s}</p>
              <p className="text-sm text-night/65">{c}</p>
              <p className="font-round text-sm font-bold text-turf sm:text-right">{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <div className="rounded-blob bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-bold">Book a visit</h2>
          <p className="mt-2 text-sm text-night/70">
            Write what is going on and when you want to come. For emergencies skip this form
            and call; the phone is answered faster.
          </p>
          <div className="mt-5">
            <LeadForm kind="vet" />
          </div>
        </div>
        <div className="rounded-blob border-2 border-dashed border-night/20 p-6 font-round text-sm">
          <p className="font-display text-xl font-bold">House calls</p>
          <p className="mt-2 text-night/70">
            Inside G-10 and G-11 the vet comes to you for vaccines and follow-ups, mostly in the
            quieter hours. Ask on the phone; the fee depends on where you live and the time.
          </p>
          <p className="mt-4 text-night/70">
            Pharmacy shelf is public: dewormers, spot-ons, calcium, wound sprays. Show us the
            pet or a photo and we will hand you the right one, not the expensive one.
          </p>
        </div>
      </section>
    </div>
  );
}
