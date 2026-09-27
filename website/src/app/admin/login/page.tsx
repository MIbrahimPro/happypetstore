"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError((await res.json()).error || "Login failed");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm border-2 border-paper/30 p-6">
        <p className="font-display text-2xl">
          STAFF <span className="text-red">LOGIN</span>
        </p>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-paper/50">
          Counter book access
        </p>
        <label className="mt-5 block">
          <span className="font-mono text-xs uppercase tracking-widest text-paper/60">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full border-2 border-paper/40 bg-transparent px-3 py-2 font-mono text-sm text-paper outline-none focus:border-paper"
            autoComplete="username"
          />
        </label>
        <label className="mt-3 block">
          <span className="font-mono text-xs uppercase tracking-widest text-paper/60">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border-2 border-paper/40 bg-transparent px-3 py-2 font-mono text-sm text-paper outline-none focus:border-paper"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="mt-3 border-2 border-red px-3 py-2 font-mono text-sm">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full border-2 border-paper bg-red px-4 py-2.5 font-display text-paper hover:bg-red-dark disabled:opacity-60"
        >
          {busy ? "CHECKING…" : "OPEN THE BOOK"}
        </button>
        <p className="mt-4 font-mono text-[11px] text-paper/40">
          Logins are set by the shop in .env (ADMIN_USER, ADMIN_PASS). Ask the owner for yours.
        </p>
      </form>
    </div>
  );
}
