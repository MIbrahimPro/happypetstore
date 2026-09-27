import { connectDB } from "@/lib/mongo";
import { Product } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import AdminGate from "@/components/AdminGate";
import ProductForm, { ProductFormValues } from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const ok = await isAuthed();
  if (!ok) return <AdminGate ok={false} />;

  const { id } = await params;
  await connectDB();
  const doc: any = await Product.findById(id).lean();
  if (!doc) {
    return <div className="px-8 py-10 font-mono text-sm">Product not found.</div>;
  }

  const initial: ProductFormValues = {
    _id: String(doc._id),
    slug: doc.slug,
    name: doc.name,
    brand: doc.brand || "",
    category: doc.category,
    petTypes: doc.petTypes || [],
    price: doc.price,
    oldPrice: doc.oldPrice ?? null,
    unit: doc.unit || "piece",
    stock: doc.stock,
    lowStockAt: doc.lowStockAt ?? 3,
    image: doc.image || "",
    blurb: doc.blurb || "",
    active: doc.active !== false,
  };

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="font-display text-3xl">EDIT: {doc.name}</h1>
      <div className="mt-6">
        <ProductForm initial={initial} />
      </div>
    </div>
  );
}
