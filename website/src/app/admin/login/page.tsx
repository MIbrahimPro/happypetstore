"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";

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
      <form onSubmit={submit} className="w-full max-w-sm rounded-blob border border-bone/15 bg-[#141314] p-7">
        <Wordmark onNight scriptHeight={26} />
        <p className="mt-2 font-round text-xs uppercase tracking-widest text-bone/50">
          Staff login · counter book access
        </p>
        <label className="mt-6 block">
          <span className="font-round text-xs uppercase tracking-widest text-bone/60">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-2xl rounded-2xl rounded-2xl border border-bone/20 bg-transparent px-3.5 py-2.5 font-round text-sm text-bone outline-none focus:border-amber"
            autoComplete="username"
          />
        </label>
        <label className="mt-3 block">
          <span className="font-round text-xs uppercase tracking-widest text-bone/60">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-2xl rounded-2xl rounded-2xl border border-bone/20 bg-transparent px-3.5 py-2.5 font-round text-sm text-bone outline-none focus:border-amber"
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="mt-3 rounded-2xl bg-collar/20 px-3.5 py-2.5 font-round text-sm text-bone">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="btn-soft mt-6 w-full justify-center bg-amber text-night hover:brightness-105 disabled:opacity-60"
        >
          {busy ? "Checking…" : "Open the book"}
        </button>
        <p className="mt-4 font-round text-[11px] text-bone/40">
          Logins are set by the shop in .env (ADMIN_USER, ADMIN_PASS). Ask the owner for yours.
        </p>
      </form>
    </div>
  );
}
