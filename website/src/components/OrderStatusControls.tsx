"use client";
import { BASE } from "@/lib/base";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NEXT: Record<string, string[]> = {
  new: ["confirmed", "cancelled"],
  confirmed: ["packed", "cancelled"],
  packed: ["delivered", "cancelled"],
  delivered: [],
  cancelled: ["new"],
};

export default function OrderStatusControls({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function set(next: string) {
    setBusy(true);
    await fetch(`${BASE}/api/admin/orders/${id}`, {
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
          className="border border-bone/25 px-2 py-1 font-round text-[11px] uppercase tracking-widest hover:bg-bone hover:text-bone disabled:opacity-50"
        >
          {n === "cancelled" ? "✕ cancel" : `→ ${n}`}
        </button>
      ))}
    </div>
  );
}
