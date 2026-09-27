"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NEXT: Record<string, string[]> = {
  new: ["contacted", "lost"],
  contacted: ["visited", "lost"],
  visited: ["won", "lost"],
  won: [],
  lost: ["new"],
};

export default function LeadStatusControls({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function set(next: string) {
    setBusy(true);
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {(NEXT[status] ?? []).map((n) => (
        <button
          key={n}
          onClick={() => set(n)}
          disabled={busy}
          className="border border-paper/40 px-2 py-1 font-mono text-[11px] uppercase tracking-widest hover:bg-paper hover:text-ink disabled:opacity-50"
        >
          {n === "lost" ? "✕ lost" : `→ ${n}`}
        </button>
      ))}
    </div>
  );
}
