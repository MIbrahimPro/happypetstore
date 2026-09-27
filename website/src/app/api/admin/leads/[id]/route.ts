import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import { Lead } from "@/lib/models";
import { isAuthed } from "@/lib/auth";

const ALLOWED = ["new", "contacted", "visited", "won", "lost"];

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await ctx.params;
  const { status } = await req.json();
  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ error: "Bad status" }, { status: 400 });
  }
  await Lead.findByIdAndUpdate(id, { status });
  return NextResponse.json({ ok: true });
}
