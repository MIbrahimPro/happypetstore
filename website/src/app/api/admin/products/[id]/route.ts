import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { Product, StockMove } from "@/lib/models";
import { isAuthed } from "@/lib/auth";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await ctx.params;
  const b = await req.json();

  const doc = await Product.findById(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const before = doc.stock;

  const fields = [
    "name",
    "brand",
    "category",
    "unit",
    "image",
    "blurb",
  ] as const;
  for (const f of fields) {
    if (typeof b[f] === "string") (doc as any)[f] = b[f];
  }
  if (Array.isArray(b.petTypes)) doc.petTypes = b.petTypes;
  if (b.price != null) doc.price = Math.max(0, Number(b.price));
  if (b.oldPrice != null) doc.oldPrice = b.oldPrice ? Number(b.oldPrice) : undefined;
  if (b.lowStockAt != null) doc.lowStockAt = Math.max(0, Number(b.lowStockAt));
  if (typeof b.active === "boolean") doc.active = b.active;
  if (b.stock != null && Number(b.stock) !== before) {
    doc.stock = Math.max(0, Number(b.stock));
  }
  if (typeof b.slug === "string" && b.slug.trim()) doc.slug = b.slug.trim().toLowerCase();

  await doc.save();

  if (doc.stock !== before) {
    await StockMove.create({
      product: doc._id,
      productName: doc.name,
      kind: "adjust",
      qty: doc.stock - before,
      note: "Edited from product form",
      by: "admin",
    });
  }

  return NextResponse.json({ ok: true });
}
