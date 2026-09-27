import { asset } from "@/lib/base";
import { SITE, telLink, waLink } from "@/lib/site";
import LeadForm from "@/components/LeadForm";
import Swiggle from "@/components/Swiggle";

export const metadata = { title: "The 24/7 clinic" };

/* what we do, what it runs — cards sell better than a spreadsheet */
const SERVICES: { name: string; covers: string; band: string; tag: string }[] = [
  { name: "Vaccines", covers: "Kitten and puppy courses, boosters, rabies", band: "Rs 1,500–3,500 / shot", tag: "Most booked" },
  { name: "Deworming", covers: "Every 3 months, dosed by weight in front of you", band: "Rs 500–1,200", tag: "10 minutes" },
  { name: "Tick & flea plan", covers: "Spot-on course plus a house checklist that actually works", band: "Rs 1,400 / month", tag: "Season needs it" },
  { name: "Grooming wash", covers: "Medicated bath for skin cases, ringworm-safe protocol", band: "Rs 1,000–2,500", tag: "By the vet" },
  { name: "Minor injuries", covers: "Cuts, abscesses, torn nails, hot spots", band: "from Rs 1,000", tag: "Same visit" },
  { name: "Emergency triage", covers: "Poisoning, bloat, heatstroke, accidents", band: "Come now, pay after", tag: "24/7" },
];

export default function ClinicPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* ------------------------------------------------------------ hero */}
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            A vet who picks up
            <br />
            <span className="relative inline-block text-collar">
              at 3 a.m.
              <Swiggle className="absolute -bottom-2 left-0 h-5 w-full" color="var(--amber)" strokeWidth={6} />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-night/75">
            Nights belong to emergencies: call first so the vet meets you at the door with the
            table ready. Days are for planned visits — vaccines, deworming, grooming, the
            itchy-ear check you keep putting off.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-night px-3.5 py-1.5 font-round text-xs font-bold text-bone">
              Vet on call 24 / 7
            </span>
            <span className="rounded-full bg-white px-3.5 py-1.5 font-round text-xs font-bold text-night shadow-softer">
              Walk in, no appointment
            </span>
            <span className="rounded-full bg-white px-3.5 py-1.5 font-round text-xs font-bold text-night shadow-softer">
              Medicine shelf is public
            </span>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={telLink()} className="btn-soft bg-collardeep text-bone shadow-soft hover:brightness-110">
              Call {SITE.phone}
            </a>
            <a
              href={waLink("Assalam o alaikum, I need the vet. ")}
              className="btn-soft bg-turfdeep text-bone hover:brightness-110"
            >
              WhatsApp the vet
            </a>
            <span className="inline-flex items-center font-round text-xs font-semibold text-ink">
              Emergencies skip the queue, always
            </span>
          </div>
        </div>

        <div>
          <div className="fur-dark rounded-blob p-6 text-bone shadow-soft">
            <p className="caption font-round text-xs uppercase text-amber">Opening hours</p>
            <p className="mt-3 font-display text-5xl font-extrabold">24 / 7</p>
            <p className="mt-2 font-round text-sm text-bone/80">
              Planned visits any time. Emergencies skip the queue, always.
            </p>
            <p className="caption mt-5 font-round text-xs uppercase text-bone/80">
              Walk in: {SITE.addressShort}
            </p>
          </div>
          <div className="mt-6 -rotate-1 overflow-hidden rounded-blob bg-white p-2.5 shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/images/shop/clinic-counter.jpg")} alt="Clinic counter" className="h-56 w-full rounded-[1.2rem] object-cover" />
            <p className="caption py-2 text-center font-round text-[11px] uppercase">
              The clinic counter, stocked like a pharmacy
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------- what it costs, cards */}
      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold">What it costs</h2>
            <p className="mt-2 font-round text-sm text-ink">
              Honest bands, not hidden quotes. Exact price depends on weight and case.
            </p>
          </div>
          <a href={telLink()} className="warm-link hidden shrink-0 font-round text-sm font-bold text-night/80 sm:inline-block">
            Ask for a quote
          </a>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.name} className="softcard flex h-full flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-round text-base font-bold">{s.name}</p>
                <span className="rounded-full bg-night px-2.5 py-1 font-round text-[10px] font-bold uppercase tracking-wider text-amber">
                  {s.tag}
                </span>
              </div>
              <p className="mt-1.5 flex-1 text-sm leading-snug text-night/70">{s.covers}</p>
              <p className="mt-3 border-t border-night/10 pt-3 font-round text-sm font-bold text-turfdeep">
                {s.band}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ call immediately if */}
      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="softcard overflow-hidden">
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

        <div className="rounded-blob border-2 border-dashed border-night/20 p-6 font-round text-sm">
          <p className="font-display text-xl font-bold">House calls</p>
          <p className="mt-2 leading-relaxed text-night/70">
            Inside G-10 and G-11 the vet comes to you for vaccines and follow-ups, mostly in the
            quieter hours. Ask on the phone; the fee depends on where you live and the time.
          </p>
          <p className="mt-4 leading-relaxed text-night/70">
            Pharmacy shelf is public: dewormers, spot-ons, calcium, wound sprays. Show us the
            pet or a photo and we will hand you the right one, not the expensive one.
          </p>
          <div className="relative mt-6 overflow-hidden rounded-[2rem] shadow-soft">
            <iframe
              src={SITE.mapEmbedPlain}
              width="100%"
              height="240"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Happy Tails clinic on Google Maps"
            />
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
      </section>

      {/* --------------------------------------------------------- book a visit */}
      <section className="mt-14">
        <div className="rounded-blob bg-white p-6 shadow-soft">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="font-display text-2xl font-bold">Book a visit</h2>
              <p className="mt-2 text-sm leading-relaxed text-night/70">
                Write what is going on and when you want to come. For emergencies skip this form
                and call; the phone is answered faster.
              </p>
              <div className="mt-5">
                <LeadForm kind="vet" />
              </div>
            </div>
            <div className="fur-dark rounded-blob p-5 text-bone">
              <p className="caption font-round text-xs uppercase text-amber">When you arrive</p>
              <ul className="mt-3 space-y-2.5 font-round text-sm text-bone/90">
                <li className="flex gap-2"><span className="text-amber">•</span> Tell the counter it is your first visit; a card is opened for your pet.</li>
                <li className="flex gap-2"><span className="text-amber">•</span> Bring any medicine you already gave, or a photo of it.</li>
                <li className="flex gap-2"><span className="text-amber">•</span> Cats travel calmer in a carrier; we keep spares at the door.</li>
                <li className="flex gap-2"><span className="text-amber">•</span> Pay after the check-up — cash or transfer.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
