import { connectDB } from "@/lib/mongo";
import { Order } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import AdminGate from "@/components/AdminGate";
import OrderStatusControls from "@/components/OrderStatusControls";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "confirmed", "packed", "delivered", "cancelled"];

async function getOrders() {
  await connectDB();
  const docs = await Order.find().sort({ createdAt: -1 }).limit(100).lean();
  return JSON.parse(JSON.stringify(docs));
}

export default async function AdminOrdersPage() {
  const ok = await isAuthed();
  if (!ok) return <AdminGate ok={false} />;
  const orders = await getOrders();

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="font-display text-3xl">ORDERS</h1>
      <p className="font-mono text-xs uppercase tracking-widest text-paper/50">
        WhatsApp baskets land here. Move them left to right, phone the customer at confirmed.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {STATUSES.map((status) => {
          const list = orders.filter((o: any) => o.status === status);
          const value = list.reduce((a: number, o: any) => a + o.total, 0);
          return (
            <section key={status} className="border-2 border-paper/30">
              <div className="flex items-center justify-between border-b-2 border-paper/30 px-3 py-2">
                <p className="font-mono text-xs uppercase tracking-widest text-mustard">
                  {status} ({list.length})
                </p>
                <p className="font-mono text-xs text-paper/60">{formatPKR(value)}</p>
              </div>
              {list.length === 0 ? (
                <p className="px-3 py-4 font-mono text-xs text-paper/40">Empty</p>
              ) : (
                <ul className="divide-y divide-paper/15">
                  {list.map((o: any) => (
                    <li key={String(o._id)} className="px-3 py-3">
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-sm">
                          <span className="text-mustard">{o.ref}</span> · {o.customerName} ·{" "}
                          <a href={`tel:+92${o.phone.replace(/^0/, "")}`} className="underline">
                            {o.phone}
                          </a>
                        </p>
                        <p className="font-display">{formatPKR(o.total)}</p>
                      </div>
                      <ul className="mt-1 font-mono text-xs text-paper/60">
                        {o.items.map((i: any, idx: number) => (
                          <li key={idx}>
                            {i.qty} x {i.name} @ {formatPKR(i.price)}
                          </li>
                        ))}
                      </ul>
                      {o.address ? <p className="mt-1 font-mono text-xs text-paper/50">Addr: {o.address}</p> : null}
                      {o.note ? <p className="font-mono text-xs text-paper/50">Note: {o.note}</p> : null}
                      <OrderStatusControls id={String(o._id)} status={o.status} />
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
