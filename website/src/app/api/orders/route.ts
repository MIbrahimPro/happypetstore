import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { Order, Product, Customer } from "@/lib/models";

type Incoming = {
  customerName: string;
  phone: string;
  address?: string;
  note?: string;
  items: { slug: string; qty: number }[];
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = (await req.json()) as Incoming;

    const name = (body.customerName || "").trim();
    const phone = (body.phone || "").trim();
    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }
    if (!/^0?3\d{9}$/.test(phone.replace(/[\s-]/g, ""))) {
      return NextResponse.json({ error: "Invalid Pakistani mobile number" }, { status: 400 });
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Re-price from the database. Never trust client prices.
    const priced: { product: any; name: string; qty: number; price: number }[] = [];
    for (const line of body.items) {
      const p: any = await Product.findOne({ slug: line.slug, active: true }).lean();
      if (!p) continue;
      const qty = Math.max(1, Math.min(50, Math.floor(line.qty)));
      priced.push({ product: p._id, name: p.name, qty, price: p.price });
    }
    if (priced.length === 0) {
      return NextResponse.json({ error: "No valid items in cart" }, { status: 400 });
    }

    const total = priced.reduce((a, b) => a + b.qty * b.price, 0);
    const ref = "HT-" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 90 + 10);

    const order = await Order.create({
      ref,
      customerName: name,
      phone,
      address: (body.address || "").trim(),
      note: (body.note || "").trim(),
      items: priced,
      total,
      status: "new",
    });

    // CRM: upsert the customer from the order
    const normPhone = phone.replace(/[\s-]/g, "");
    await Customer.findOneAndUpdate(
      { phone: normPhone },
      {
        $set: { name, address: (body.address || "").trim() },
        $inc: { ordersCount: 1, totalSpent: total },
        $setOnInsert: { phone: normPhone },
        lastOrderAt: new Date(),
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, ref: order.ref, total });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Order failed" }, { status: 500 });
  }
}
