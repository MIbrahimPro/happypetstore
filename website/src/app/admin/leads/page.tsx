import { connectDB } from "@/lib/mongo";
import { Lead } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import AdminGate from "@/components/AdminGate";
import LeadStatusControls from "@/components/LeadStatusControls";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "visited", "won", "lost"];

async function getLeads() {
  await connectDB();
  const docs = await Lead.find().sort({ createdAt: -1 }).limit(200).lean();
  return JSON.parse(JSON.stringify(docs));
}

export default async function AdminLeadsPage() {
  const ok = await isAuthed();
  if (!ok) return <AdminGate ok={false} />;
  const leads = await getLeads();

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="font-display text-3xl">LEAD DESK</h1>
      <p className="font-round text-xs uppercase tracking-widest text-bone/50">
        Adoption and vet enquiries. Call, then move the card.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {STATUSES.map((status) => {
          const list = leads.filter((l: any) => l.status === status);
          return (
            <section key={status} className="border-2 border-bone/15">
              <div className="flex items-center justify-between border-b-2 border-bone/15 px-3 py-2">
                <p className="font-round text-xs uppercase tracking-widest text-amber">{status}</p>
                <p className="font-round text-xs text-bone/60">{list.length}</p>
              </div>
              {list.length === 0 ? (
                <p className="px-3 py-4 font-round text-xs text-bone/40">Empty</p>
              ) : (
                <ul className="divide-y divide-paper/15">
                  {list.map((l: any) => (
                    <li key={String(l._id)} className="px-3 py-3">
                      <p className="font-round text-[11px] uppercase tracking-widest text-bone/40">{l.kind}</p>
                      <p className="font-display text-lg leading-tight">{l.name}</p>
                      <p className="mt-1 font-round text-xs">
                        <a href={`tel:+92${String(l.phone).replace(/^0/, "")}`} className="underline">
                          {l.phone}
                        </a>
                      </p>
                      {l.message && <p className="mt-1 font-round text-xs text-bone/60">{l.message}</p>}
                      <LeadStatusControls id={String(l._id)} status={l.status} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
