import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { Customer } from "@/lib/models";
import { isAuthed } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const docs = await Customer.find().sort({ totalSpent: -1 }).lean();

  const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["name", "phone", "orders", "spent", "lastOrder", "address"].join(","),
    ...docs.map((c: any) =>
      [c.name, c.phone, c.ordersCount, c.totalSpent, c.lastOrderAt?.toISOString() ?? "", c.address]
        .map(esc)
        .join(",")
    ),
  ].join("\n");

  return new NextResponse(rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="happytails-customers.csv"`,
    },
  });
}
