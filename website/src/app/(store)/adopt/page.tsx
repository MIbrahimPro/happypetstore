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
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            THEY SIT IN THE WINDOW,
            <br />
            <span className="text-red">YOU COME AND SIT WITH THEM.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/80">
            We do not sell animals through a website form. Visit the shop, hold the kitten,
            watch the puppy walk. Every animal leaves with a vaccine card and a deworming
            record, and we remain a phone call away for the life of the pet.
          </p>
          <div className="mt-6 cutline max-w-xl" />
          <ul className="mt-6 space-y-2 font-mono text-sm">
            <li className="flex gap-3"><span className="text-red">01</span> Visit Ramna Plaza, G-10 Markaz, any hour.</li>
            <li className="flex gap-3"><span className="text-red">02</span> The vet checks your pick in front of you.</li>
            <li className="flex gap-3"><span className="text-red">03</span> You get the card, the food plan, and our number.</li>
          </ul>
        </div>
        <div className="sticker -rotate-1 self-start">
          <div className="border-2 border-ink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CAT_IMG} alt="Persian kitten at the shop" className="h-64 w-full object-cover" />
          </div>
          <p className="py-2 text-center font-mono text-[11px] uppercase tracking-widest text-ink/70">
            The window shelf, most mornings
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl">IN THE SHOP THIS WEEK</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="border-2 border-ink bg-white hardshadow">
            <div className="flex items-center gap-3 border-b-2 border-ink bg-paper px-4 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CAT_IMG} alt="" className="h-8 w-8 border border-ink object-cover" />
              <p className="font-display text-xl">CATS</p>
            </div>
            <ul className="divide-y divide-ink/15">
              {cats.map((c: any) => (
                <li key={c._id} className="px-4 py-3">
                  <p className="font-display">{c.name}</p>
                  <p className="mt-0.5 text-sm text-ink/70">{c.message}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-ink bg-white hardshadow">
            <div className="flex items-center gap-3 border-b-2 border-ink bg-paper px-4 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DOG_IMG} alt="" className="h-8 w-8 border border-ink object-cover" />
              <p className="font-display text-xl">DOGS</p>
            </div>
            <ul className="divide-y divide-ink/15">
              {dogs.map((d: any) => (
                <li key={d._id} className="px-4 py-3">
                  <p className="font-display">{d.name}</p>
                  <p className="mt-0.5 text-sm text-ink/70">{d.message}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <div className="border-2 border-ink bg-bone p-6">
          <h2 className="font-display text-2xl">RESERVE A VISIT</h2>
          <p className="mt-2 text-sm text-ink/75">
            Tell us who you came to see and a number. We keep the animal front and centre when
            you arrive. No fee, no obligation.
          </p>
          <div className="mt-5">
            <LeadForm kind="adoption" />
          </div>
        </div>
        <div>
          <div className="sticker rotate-1">
            <div className="border-2 border-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DOG_IMG} alt="Puppy at the shop" className="h-72 w-full object-cover" />
            </div>
          </div>
          <p className="mt-6 font-mono text-sm text-steel">
            The shop is open 24/7, but most litters are awake and playful before noon. Address:{" "}
            {SITE.addressShort}.
          </p>
        </div>
      </section>
    </div>
  );
}
