import { connectDB } from "@/lib/mongo";
import { Product, StockMove } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import AdminGate from "@/components/AdminGate";
import StockControls from "@/components/StockControls";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getData() {
  await connectDB();
  const [products, moves] = await Promise.all([
    Product.find().sort({ stock: 1 }).lean(),
    StockMove.find().sort({ createdAt: -1 }).limit(30).lean(),
  ]);
  return {
    products: JSON.parse(JSON.stringify(products)),
    moves: JSON.parse(JSON.stringify(moves)),
  };
}

export default async function AdminStockPage() {
  const ok = await isAuthed();
  if (!ok) return <AdminGate ok={false} />;
  const { products, moves } = await getData();

  const low = products.filter((p: any) => p.stock <= p.lowStockAt);

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="font-display text-3xl">STOCK DESK</h1>
      <p className="font-round text-xs uppercase tracking-widest text-bone/80">
        Every change is written to the movement log below. Sales deduct automatically at order time.
      </p>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section>
          <p className="font-round text-xs uppercase tracking-widest text-amber">
            LOW STOCK FIRST ({low.length} items need attention)
          </p>
          <div className="mt-3 border-2 border-bone/15">
            <ul className="divide-y divide-paper/15">
              {products.map((p: any) => (
                <li key={String(p._id)} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
                  <div>
                    <p className="font-display">{p.name}</p>
                    <p className="font-round text-[11px] uppercase tracking-widest text-bone/80">
                      {p.category} / alert below {p.lowStockAt + 1}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-round text-sm ${p.stock === 0 ? "text-collar" : p.stock <= p.lowStockAt ? "text-amber" : "text-bone/70"}`}>
                      {p.stock} on shelf
                    </span>
                    <StockControls id={String(p._id)} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <p className="font-round text-xs uppercase tracking-widest text-amber">MOVEMENT LOG (LATEST 30)</p>
          <div className="mt-3 border-2 border-bone/15 bg-black/20">
            <ul className="divide-y divide-paper/10 font-round text-xs">
              {moves.length === 0 && <li className="px-3 py-3 text-bone/75">No movements yet.</li>}
              {moves.map((m: any) => (
                <li key={String(m._id)} className="px-3 py-2">
                  <span className={m.qty >= 0 ? "text-turf" : "text-collarlight"}>
                    {m.qty >= 0 ? "+" : ""}
                    {m.qty}
                  </span>{" "}
                  <span className="uppercase tracking-widest text-bone/80">{m.kind}</span>{" "}
                  {m.productName}
                  {m.note ? <span className="text-bone/75"> / {m.note}</span> : null}
                  <span className="block text-bone/70">
                    {new Date(m.createdAt).toLocaleString("en-GB")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 border-2 border-dashed border-bone/15 p-4 font-round text-xs text-bone/85">
            Shelf value now: {formatPKR(products.reduce((a: number, p: any) => a + p.price * p.stock, 0))}
          </div>
        </section>
      </div>
    </div>
  );
}
