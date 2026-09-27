import { asset } from "@/lib/base";
import { connectDB } from "@/lib/mongo";
import { Lead } from "@/lib/models";
import LeadForm from "@/components/LeadForm";
import { SITE, telLink, waLink } from "@/lib/site";
import Swiggle from "@/components/Swiggle";

export const dynamic = "force-dynamic";
export const metadata = { title: "Adopt a kitten or puppy" };

const CAT_IMG = "/images/pets/kitten-1.jpg";
const DOG_IMG = "/images/pets/puppy-1.jpg";

async function getPets() {
  try {
    await connectDB();
    const docs = await Lead.find({ kind: "adoption" }).sort({ createdAt: 1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch {
    return [];
  }
}

export default async function AdoptPage() {
  const pets = await getPets();
  const cats = pets.filter((p: any) => p.name.toLowerCase().includes("kitten") || p.name.toLowerCase().includes("tabby") || p.name.toLowerCase().includes("cat"));
  const dogs = pets.filter((p: any) => !cats.includes(p));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* ------------------------------------------------------------ hero */}
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            They sit in the window,
            <br />
            <span className="relative inline-block text-collar">
              you come and sit with them.
              <Swiggle className="absolute -bottom-2 left-0 h-5 w-full" color="var(--amber)" strokeWidth={6} />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-night/75">
            We do not sell animals through a website form. Visit the shop, hold the kitten,
            watch the puppy walk. You will know within a minute — that is the whole point.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-night px-3.5 py-1.5 font-round text-xs font-bold text-bone">
              Vaccine card included
            </span>
            <span className="rounded-full bg-white px-3.5 py-1.5 font-round text-xs font-bold text-night shadow-softer">
              Deworming record
            </span>
            <span className="rounded-full bg-white px-3.5 py-1.5 font-round text-xs font-bold text-night shadow-softer">
              Our number for life
            </span>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={telLink()} className="btn-soft bg-collardeep text-bone shadow-soft hover:brightness-110">
              Call {SITE.phone}
            </a>
            <a
              href={waLink("Assalam o alaikum, I want to visit the litters. ")}
              target="_blank"
              rel="noreferrer"
              className="btn-soft bg-turfdeep text-bone hover:brightness-110"
            >
              WhatsApp us
            </a>
          </div>

          <ul className="mt-8 space-y-2.5 font-round text-sm">
            <li className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-night font-round text-xs font-bold text-amber">01</span>
              Visit Ramna Plaza, G-10 Markaz, any hour.
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-night font-round text-xs font-bold text-amber">02</span>
              The vet checks your pick in front of you.
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-night font-round text-xs font-bold text-amber">03</span>
              You get the card, the food plan, and our number.
            </li>
          </ul>
        </div>
        <div className="animate-sway self-start rounded-blob bg-white p-2.5 shadow-soft -rotate-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(CAT_IMG)} alt="Persian kitten at the shop" className="h-64 w-full rounded-[1.2rem] object-cover" />
          <p className="caption py-2 text-center font-round text-[11px] uppercase">
            The window shelf, most mornings
          </p>
        </div>
      </div>

      {/* ------------------------------------------------- what comes with */}
      <section className="mt-14 rounded-blob bg-night p-6 text-bone shadow-soft sm:p-8">
        <p className="caption font-round text-xs uppercase text-amber">Every adoption includes</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Vaccine card", "Dated, stamped, with the next due date written out."],
            ["Deworming record", "Done before they leave, repeated on the card."],
            ["Food plan", "What they are eating now and how to switch safely."],
            ["Our number", "Call at 3 a.m. if the first night goes sideways."],
          ].map(([h, s]) => (
            <div key={h} className="rounded-2xl border border-bone/15 p-4">
              <p className="font-round text-sm font-bold text-amber">{h}</p>
              <p className="mt-1.5 font-round text-sm leading-snug text-bone/80">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ in the shop this week */}
      <section className="mt-14">
        <h2 className="font-display text-3xl font-bold">In the shop this week</h2>
        <p className="mt-2 font-round text-sm text-ink">
          Who is on the window shelf right now. They move fast — a call saves the trip.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="softcard flex h-full flex-col overflow-hidden">
            <div className="flex items-center gap-3 bg-night px-4 py-2.5 text-bone">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(CAT_IMG)} alt="" className="h-8 w-8 rounded-full object-cover" />
              <p className="font-display text-xl font-bold">Cats</p>
              <span className="ml-auto rounded-full bg-night/70 px-2.5 py-1 font-round text-[11px] font-bold uppercase tracking-wider text-bone">
                {cats.length} waiting
              </span>
            </div>
            <ul className="flex-1 divide-y divide-night/10">
              {cats.length === 0 && (
                <li className="px-4 py-4 font-round text-sm text-ink">
                  New litter expected any day — call and we will tell you honestly.
                </li>
              )}
              {cats.map((c: any) => (
                <li key={c._id} className="px-4 py-3">
                  <p className="font-round text-sm font-bold leading-snug">{c.name}</p>
                  <p className="mt-0.5 text-sm leading-snug text-night/70">{c.message}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="softcard flex h-full flex-col overflow-hidden">
            <div className="flex items-center gap-3 bg-turfdeep px-4 py-2.5 text-bone">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(DOG_IMG)} alt="" className="h-8 w-8 rounded-full object-cover" />
              <p className="font-display text-xl font-bold">Dogs</p>
              <span className="ml-auto rounded-full bg-night/70 px-2.5 py-1 font-round text-[11px] font-bold uppercase tracking-wider text-bone">
                {dogs.length} waiting
              </span>
            </div>
            <ul className="flex-1 divide-y divide-night/10">
              {dogs.length === 0 && (
                <li className="px-4 py-4 font-round text-sm text-ink">
                  Litters move within days — call and we will say what is coming.
                </li>
              )}
              {dogs.map((d: any) => (
                <li key={d._id} className="px-4 py-3">
                  <p className="font-round text-sm font-bold leading-snug">{d.name}</p>
                  <p className="mt-0.5 text-sm leading-snug text-night/70">{d.message}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- reserve a visit */}
      <section className="mt-14 grid gap-10 lg:grid-cols-2">
        <div className="rounded-blob bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-bold">Reserve a visit</h2>
          <p className="mt-2 text-sm leading-relaxed text-night/70">
            Tell us who you came to see and a number. We keep the animal front and centre when
            you arrive. No fee, no obligation.
          </p>
          <div className="mt-5">
            <LeadForm kind="adoption" />
          </div>
        </div>
        <div>
          <div className="rotate-1 overflow-hidden rounded-blob bg-white p-2.5 shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(DOG_IMG)} alt="Puppy at the shop" className="h-72 w-full rounded-[1.2rem] object-cover" />
          </div>
          <p className="mt-5 font-round text-sm leading-relaxed text-ink">
            The shop is open 24/7, but most litters are awake and playful before noon. Address:{" "}
            {SITE.addressShort}.
          </p>
        </div>
      </section>
    </div>
  );
}
