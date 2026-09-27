import { isAuthed } from "@/lib/auth";
import AdminGate from "@/components/AdminGate";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const ok = await isAuthed();
  if (!ok) return <AdminGate ok={false} />;

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="font-display text-3xl">NEW PRODUCT</h1>
      <div className="mt-6">
        <ProductForm
          initial={{
            slug: "",
            name: "",
            brand: "Happy Tails picks",
            category: "food",
            petTypes: ["dog", "cat"],
            price: 0,
            oldPrice: null,
            unit: "piece",
            stock: 0,
            lowStockAt: 3,
            image: "",
            blurb: "",
            active: true,
          }}
        />
      </div>
    </div>
  );
}
