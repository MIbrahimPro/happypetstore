import { connectDB } from "@/lib/mongo";
import { Lead } from "@/lib/models";
import LeadForm from "@/components/LeadForm";
import { SITE } from "@/lib/site";

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
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            They sit in the window,
            <br />
            <span className="text-collar">you come and sit with them.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-night/75">
            We do not sell animals through a website form. Visit the shop, hold the kitten,
            watch the puppy walk. Every animal leaves with a vaccine card and a deworming
            record, and we remain a phone call away for the life of the pet.
          </p>
          <ul className="mt-7 space-y-2 font-round text-sm">
            <li className="flex gap-3"><span className="font-bold text-collar">01</span> Visit Ramna Plaza, G-10 Markaz, any hour.</li>
            <li className="flex gap-3"><span className="font-bold text-collar">02</span> The vet checks your pick in front of you.</li>
            <li className="flex gap-3"><span className="font-bold text-collar">03</span> You get the card, the food plan, and our number.</li>
          </ul>
        </div>
        <div className="animate-sway self-start rounded-blob bg-white p-2.5 shadow-soft -rotate-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CAT_IMG} alt="Persian kitten at the shop" className="h-64 w-full rounded-[1.2rem] object-cover" />
          <p className="caption py-2 text-center font-round text-[11px] uppercase">
            The window shelf, most mornings
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold">In the shop this week</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="softcard overflow-hidden">
            <div className="flex items-center gap-3 bg-night px-4 py-2.5 text-bone">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CAT_IMG} alt="" className="h-8 w-8 rounded-full object-cover" />
              <p className="font-display text-xl font-bold">Cats</p>
            </div>
            <ul className="divide-y divide-night/10">
              {cats.map((c: any) => (
                <li key={c._id} className="px-4 py-3">
                  <p className="font-round font-bold">{c.name}</p>
                  <p className="mt-0.5 text-sm text-night/65">{c.message}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="softcard overflow-hidden">
            <div className="flex items-center gap-3 bg-turf px-4 py-2.5 text-bone">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DOG_IMG} alt="" className="h-8 w-8 rounded-full object-cover" />
              <p className="font-display text-xl font-bold">Dogs</p>
            </div>
            <ul className="divide-y divide-night/10">
              {dogs.map((d: any) => (
                <li key={d._id} className="px-4 py-3">
                  <p className="font-round font-bold">{d.name}</p>
                  <p className="mt-0.5 text-sm text-night/65">{d.message}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <div className="rounded-blob bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-bold">Reserve a visit</h2>
          <p className="mt-2 text-sm text-night/70">
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
            <img src={DOG_IMG} alt="Puppy at the shop" className="h-72 w-full rounded-[1.2rem] object-cover" />
          </div>
          <p className="mt-5 font-round text-sm text-smoke">
            The shop is open 24/7, but most litters are awake and playful before noon. Address:{" "}
            {SITE.addressShort}.
          </p>
        </div>
      </section>
    </div>
  );
}
