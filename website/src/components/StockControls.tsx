"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StockControls({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function move(kind: "restock" | "damage" | "adjust", qty: number) {
    setBusy(true);
    await fetch("/api/admin/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, kind, qty, note: kind === "damage" ? "Damaged/unsellable" : "" }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => move("restock", 5)}
        disabled={busy}
        className="border border-paper/40 px-2 py-1 font-mono text-[11px] uppercase hover:bg-paper hover:text-ink disabled:opacity-50"
        title="Add 5 to shelf"
      >
        +5 restock
      </button>
      <button
        onClick={() => move("damage", -1)}
        disabled={busy}
        className="border border-paper/40 px-2 py-1 font-mono text-[11px] uppercase hover:bg-paper hover:text-ink disabled:opacity-50"
        title="Remove 1 as damaged"
      >
        −1 damage
      </button>
    </div>
  );
}
