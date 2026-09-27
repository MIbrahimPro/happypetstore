import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { Product, StockMove } from "@/lib/models";
import { isAuthed } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const b = await req.json();

  if (!b.name || b.price == null) {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  const slug = (b.slug || slugify(b.name)).toLowerCase();
  const dup = await Product.findOne({ slug }).lean();
  if (dup) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 });
  }

  const doc = await Product.create({
    slug,
    name: b.name,
    brand: b.brand || "Happy Tails picks",
    category: b.category || "food",
    petTypes: Array.isArray(b.petTypes) ? b.petTypes : [],
    price: Number(b.price),
    oldPrice: b.oldPrice ? Number(b.oldPrice) : undefined,
    unit: b.unit || "piece",
    stock: Math.max(0, Number(b.stock) || 0),
    lowStockAt: Math.max(0, Number(b.lowStockAt) || 3),
    image: b.image || "",
    blurb: b.blurb || "",
    active: b.active !== false,
  });

  if (doc.stock > 0) {
    await StockMove.create({
      product: doc._id,
      productName: doc.name,
      kind: "restock",
      qty: doc.stock,
      note: "Opening stock",
      by: "admin",
    });
  }

  return NextResponse.json({ ok: true, id: doc._id, slug: doc.slug });
}
