import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { Product, StockMove } from "@/lib/models";
import { isAuthed } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const b = await req.json();

  const doc = await Product.findById(b.productId);
  if (!doc) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const qty = Math.floor(Number(b.qty) || 0);
  if (qty === 0) return NextResponse.json({ error: "Qty is zero" }, { status: 400 });

  const kind = ["restock", "sale", "adjust", "return", "damage"].includes(b.kind) ? b.kind : "adjust";
  const next = doc.stock + qty;
  if (next < 0) return NextResponse.json({ error: "That would make stock negative" }, { status: 400 });

  doc.stock = next;
  await doc.save();

  await StockMove.create({
    product: doc._id,
    productName: doc.name,
    kind,
    qty,
    note: b.note || "",
    by: "admin",
  });

  return NextResponse.json({ ok: true, stock: doc.stock });
}
