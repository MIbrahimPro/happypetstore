import Link from "next/link";
import { connectDB } from "@/lib/mongo";
import { Product } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import AdminGate from "@/components/AdminGate";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getProducts() {
  await connectDB();
  const docs = await Product.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(docs));
}

export default async function AdminProductsPage() {
  const ok = await isAuthed();
  if (!ok) return <AdminGate ok={false} />;
  const products = await getProducts();

  return (
    <div className="px-4 py-6 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">PRODUCTS</h1>
          <p className="font-round text-xs uppercase tracking-widest text-bone/80">
            {products.length} items on the shelves
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="border-2 border-bone bg-collar px-4 py-2 font-display text-sm text-bone hover:bg-collardeep"
        >
          + NEW PRODUCT
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto border-2 border-bone/15">
        <table className="w-full font-round text-sm">
          <thead>
            <tr className="border-b-2 border-bone/15 text-left text-xs uppercase tracking-widest text-bone/80">
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Shelf</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={String(p._id)} className="border-b border-bone/10">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="h-9 w-9 border border-bone/15 object-cover" />
                    <div>
                      <p className="font-display">{p.name}</p>
                      <p className="text-[11px] text-bone/80">{p.brand} / {p.unit}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 uppercase text-bone/70">{p.category}</td>
                <td className="px-3 py-2">{formatPKR(p.price)}</td>
                <td className="px-3 py-2">
                  <span className={p.stock === 0 ? "font-bold text-collar" : p.stock <= p.lowStockAt ? "text-amber" : ""}>
                    {p.stock}
                    </span>
                  <span className="text-bone/75"> / {p.lowStockAt}</span>
                </td>
                <td className="px-3 py-2">
                  <Link href={`/admin/products/${p._id}`} className="underline hover:text-amber">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
