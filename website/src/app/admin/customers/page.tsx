import { connectDB } from "@/lib/mongo";
import { Customer } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import AdminGate from "@/components/AdminGate";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getCustomers() {
  await connectDB();
  const docs = await Customer.find().sort({ lastOrderAt: -1 }).limit(500).lean();
  return JSON.parse(JSON.stringify(docs));
}

export default async function AdminCustomersPage() {
  const ok = await isAuthed();
  if (!ok) return <AdminGate ok={false} />;
  const customers = await getCustomers();

  return (
    <div className="px-4 py-6 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">CUSTOMERS</h1>
          <p className="font-round text-xs uppercase tracking-widest text-bone/50">
            Built automatically from orders
          </p>
        </div>
        <a
          href="/api/admin/customers/export"
          className="border-2 border-bone/25 px-4 py-2 font-round text-xs uppercase tracking-widest hover:bg-bone hover:text-bone"
        >
          Export CSV
        </a>
      </div>

      {customers.length === 0 ? (
        <p className="mt-8 border-2 border-dashed border-bone/15 p-8 font-round text-sm text-bone/50">
          No customers yet. The first WhatsApp order creates one automatically.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto border-2 border-bone/15">
          <table className="w-full font-round text-sm">
            <thead>
              <tr className="border-b-2 border-bone/15 text-left text-xs uppercase tracking-widest text-bone/50">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Orders</th>
                <th className="px-4 py-2">Spent</th>
                <th className="px-4 py-2">Last order</th>
                <th className="px-4 py-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={String(c._id)} className="border-b border-bone/10">
                  <td className="px-4 py-2 font-display">{c.name || "Unknown"}</td>
                  <td className="px-4 py-2">
                    <a href={`tel:+92${String(c.phone).replace(/^0/, "")}`} className="underline">
                      {c.phone}
                    </a>
                    {"  "}
                    <a
                      href={`https://wa.me/92${String(c.phone).replace(/^0/, "")}`}
                      className="text-amber underline"
                      target="_blank"
                    >
                      WA
                    </a>
                  </td>
                  <td className="px-4 py-2">{c.ordersCount}</td>
                  <td className="px-4 py-2">{formatPKR(c.totalSpent)}</td>
                  <td className="px-4 py-2 text-bone/60">
                    {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString("en-GB") : "—"}
                  </td>
                  <td className="px-4 py-2 text-bone/60">{c.address || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
