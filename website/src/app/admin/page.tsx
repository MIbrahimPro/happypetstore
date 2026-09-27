import Link from "next/link";
import { connectDB } from "@/lib/mongo";
import { Product, Order, Lead, Customer, Booking } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import AdminGate from "@/components/AdminGate";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getData() {
  await connectDB();
  const [products, orders, leads, customers, bookings] = await Promise.all([
    Product.find().lean(),
    Order.find().sort({ createdAt: -1 }).limit(6).lean(),
    Lead.find().sort({ createdAt: -1 }).limit(6).lean(),
    Customer.countDocuments(),
    Booking.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  const lowStock = products
    .filter((p: any) => p.stock <= p.lowStockAt)
    .sort((a: any, b: any) => a.stock - b.stock);
  const revenue = orders.reduce((a: number, o: any) => a + (o.status !== "cancelled" ? o.total : 0), 0);
  const stockValue = await Product.aggregate([
    { $project: { v: { $multiply: ["$price", "$stock"] } } },
    { $group: { _id: null, s: { $sum: "$v" } } },
  ]);
  return {
    counts: {
      products: products.length,
      orders: orders.length,
      newLeads: leads.filter((l: any) => l.status === "new").length,
      customers,
      bookings: bookings.length,
    },
    lowStock: JSON.parse(JSON.stringify(lowStock.slice(0, 6))),
    orders: JSON.parse(JSON.stringify(orders)),
    leads: JSON.parse(JSON.stringify(leads)),
    stockValue: stockValue[0]?.s || 0,
  };
}

export default async function AdminDashboard() {
  const ok = await isAuthed();
  if (!ok) return <AdminGate ok={false} />;
  const data = await getData();

  return (
    <div className="px-4 py-6 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">THE COUNTER BOOK</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-paper/50">
            Everything that moved today
          </p>
        </div>
        <Link href="/admin/products/new" className="border-2 border-paper bg-red px-4 py-2 font-display text-sm text-paper hover:bg-red-dark">
          + NEW PRODUCT
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Orders", data.counts.orders, "/admin/orders"],
          ["New leads", data.counts.newLeads, "/admin/leads"],
          ["Customers", data.counts.customers, "/admin/customers"],
          ["Products", data.counts.products, "/admin/products"],
          ["Bookings", data.counts.bookings, "/admin/bookings"],
        ].map(([label, n, href]) => (
          <Link key={label as string} href={href as string} className="border-2 border-paper/30 p-4 hover:border-paper">
            <p className="font-mono text-xs uppercase tracking-widest text-paper/50">{label}</p>
            <p className="mt-1 font-display text-4xl">{n}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="border-2 border-paper/30">
          <div className="flex items-center justify-between border-b-2 border-paper/30 px-4 py-2">
            <p className="font-display text-lg">LOW STOCK, GO RESTOCK</p>
            <Link href="/admin/stock" className="font-mono text-xs uppercase text-mustard">
              Stock desk →
            </Link>
          </div>
          {data.lowStock.length === 0 ? (
            <p className="px-4 py-6 font-mono text-sm text-paper/50">Everything is stocked up.</p>
          ) : (
            <ul className="divide-y divide-paper/15 font-mono text-sm">
              {data.lowStock.map((p: any) => (
                <li key={String(p._id)} className="flex items-center justify-between px-4 py-2.5">
                  <span>{p.name}</span>
                  <span className={p.stock === 0 ? "font-bold text-red" : "text-mustard"}>
                    {p.stock} left / min {p.lowStockAt}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border-2 border-paper/30">
          <div className="flex items-center justify-between border-b-2 border-paper/30 px-4 py-2">
            <p className="font-display text-lg">LATEST ORDERS</p>
            <Link href="/admin/orders" className="font-mono text-xs uppercase text-mustard">
              All orders →
            </Link>
          </div>
          {data.orders.length === 0 ? (
            <p className="px-4 py-6 font-mono text-sm text-paper/50">No orders yet. Share the shop link on WhatsApp.</p>
          ) : (
            <ul className="divide-y divide-paper/15 font-mono text-sm">
              {data.orders.map((o: any) => (
                <li key={String(o._id)} className="flex items-center justify-between px-4 py-2.5">
                  <span>
                    <span className="text-mustard">{o.ref}</span> {o.customerName}
                  </span>
                  <span>
                    {formatPKR(o.total)} / {o.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border-2 border-paper/30">
          <div className="flex items-center justify-between border-b-2 border-paper/30 px-4 py-2">
            <p className="font-display text-lg">FRESH LEADS</p>
            <Link href="/admin/leads" className="font-mono text-xs uppercase text-mustard">
              Lead desk →
            </Link>
          </div>
          {data.leads.length === 0 ? (
            <p className="px-4 py-6 font-mono text-sm text-paper/50">No leads yet.</p>
          ) : (
            <ul className="divide-y divide-paper/15 font-mono text-sm">
              {data.leads.map((l: any) => (
                <li key={String(l._id)} className="flex items-center justify-between px-4 py-2.5">
                  <span>
                    <span className="text-mustard uppercase">{l.kind}</span> {l.name}
                  </span>
                  <span>{l.phone}</span>
                </li>
              ))}
            </ul>
          )}
        </section>        <section className="border-2 border-paper/30 p-4">
          <p className="font-display text-lg">STOCK VALUE ON SHELF</p>
          <p className="mt-2 font-display text-3xl text-mustard">{formatPKR(data.stockValue)}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-paper/50">price x stock, all products</p>
        </section>
      </div>
    </div>
  );
}
