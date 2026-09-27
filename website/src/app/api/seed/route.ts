import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { Product, StockMove, Lead, Booking } from "@/lib/models";
import { SEED_PRODUCTS } from "@/lib/seed-products";
import { SEED_PETS } from "@/lib/seed-pets";

export async function GET() {
  return runSeed();
}

export async function POST() {
  return runSeed();
}

async function runSeed() {
  try {
    await connectDB();
    const existing = await Product.countDocuments();
    if (existing > 0) {
      return NextResponse.json({ ok: true, message: `Already seeded (${existing} products)` });
    }

    const docs = SEED_PRODUCTS.map((p) => ({ ...p }));
    const inserted = await Product.insertMany(docs, { ordered: false });

    await StockMove.insertMany(
      inserted.map((d: any) => ({
        product: d._id,
        productName: d.name,
        kind: "restock",
        qty: d.stock,
        note: "Opening stock, first count",
        by: "seed",
      }))
    );

    await Lead.insertMany(SEED_PETS.map((p) => ({ ...p })));

    await Booking.insertMany([
      {
        name: "Ayesha K.",
        phone: "03005551234",
        pet: "Kaju, Persian cat",
        reason: "Annual vaccines due",
        slot: "Tonight 9 pm",
        status: "requested",
      },
    ]);

    return NextResponse.json({ ok: true, products: inserted.length, pets: SEED_PETS.length });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
