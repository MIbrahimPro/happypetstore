import Link from "next/link";
import { isAuthed } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";

export const metadata = { title: "Back office" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthed();

  return (
    <div className="min-h-screen bg-[#141311] text-paper">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="border-b-2 border-paper/20 lg:min-h-screen lg:w-60 lg:border-b-0 lg:border-r-2">
          <div className="border-b border-paper/15 px-4 py-4">
            <p className="font-display text-xl">
              HAPPY<span className="text-red">TAILS</span>
            </p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-paper/50">
              Back office
            </p>
          </div>
          <AdminNav authed={authed} />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
