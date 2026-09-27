import { connectDB } from "@/lib/mongo";
import { Booking } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import AdminGate from "@/components/AdminGate";

export const dynamic = "force-dynamic";

async function getBookings() {
  await connectDB();
  const docs = await Booking.find().sort({ createdAt: -1 }).limit(100).lean();
  return JSON.parse(JSON.stringify(docs));
}

export default async function AdminBookingsPage() {
  const ok = await isAuthed();
  if (!ok) return <AdminGate ok={false} />;
  const bookings = await getBookings();

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="font-display text-3xl">BOOKINGS</h1>
      <p className="font-mono text-xs uppercase tracking-widest text-paper/50">
        Vet visit requests from the clinic page. Confirm by phone.
      </p>
      {bookings.length === 0 ? (
        <p className="mt-8 border-2 border-dashed border-paper/30 p-8 font-mono text-sm text-paper/50">
          No bookings yet.
        </p>
      ) : (
        <div className="mt-6 border-2 border-paper/30">
          <ul className="divide-y divide-paper/15">
            {bookings.map((b: any) => (
              <li key={String(b._id)} className="px-4 py-3 font-mono text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p>
                    <span className="font-display text-base">{b.name}</span> · {b.phone}
                    {b.pet ? ` · ${b.pet}` : ""}
                  </p>
                  <span className="text-mustard uppercase">{b.slot}</span>
                </div>
                {b.reason && <p className="mt-1 text-paper/60">{b.reason}</p>}
                <p className="mt-1 text-[11px] text-paper/40">
                  {new Date(b.createdAt).toLocaleString("en-GB")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
