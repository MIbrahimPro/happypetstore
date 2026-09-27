import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { Lead, Booking } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const kind = ["adoption", "vet", "general"].includes(body.kind) ? body.kind : "general";
    const name = (body.name || "").trim();
    const phone = (body.phone || "").trim();
    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }
    const message = [body.message, body.slot ? `Preferred slot: ${body.slot}` : ""]
      .filter(Boolean)
      .join(" | ");

    const lead = await Lead.create({ kind, name, phone, message, source: "website" });

    if (kind === "vet" && body.slot) {
      await Booking.create({ name, phone, pet: body.petName || "", reason: body.message || "", slot: body.slot });
    }

    return NextResponse.json({ ok: true, id: lead._id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}
