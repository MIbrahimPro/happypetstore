import Link from "next/link";
import { isAuthed } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import Wordmark from "@/components/Wordmark";

export const metadata = { title: "Back office" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthed();

  return (
    <div className="min-h-screen bg-night text-bone">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-bone/15 lg:min-h-screen lg:w-60 lg:border-b-0 lg:border-r">
          <div className="border-b border-bone/10 px-4 py-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Wordmark onNight scriptHeight={20} />
            </Link>
            <p className="mt-1 font-round text-[11px] uppercase tracking-widest text-bone/80">
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
