"use client";

import { useState } from "react";

export default function LeadForm({ kind, defaultSlot }: { kind: "adoption" | "vet" | "general"; defaultSlot?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [slot, setSlot] = useState(defaultSlot ?? "");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone, that is all we need.");
      setState("error");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, name, phone, message, slot }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setState("done");
    } catch (err: any) {
      setError(err.message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="border-2 border-ink bg-white p-4 font-mono text-sm">
        <p className="font-display text-lg">NOTED. ✓</p>
        <p className="mt-1 text-ink/75">
          We will call you from 0313 1495287. If it is urgent, call us first.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-widest">Your name *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm outline-none focus:bg-mustard/20"
            placeholder="Ayesha"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-widest">Phone *</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm outline-none focus:bg-mustard/20"
            placeholder="03001234567"
          />
        </label>
      </div>
      {kind === "vet" && (
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-widest">Preferred slot</span>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm outline-none focus:bg-mustard/20"
          >
            <option value="">Any time, day or night</option>
            <option>Morning (8 to 12)</option>
            <option>Afternoon (12 to 5)</option>
            <option>Evening (5 to 10)</option>
            <option>Night (10 to 8), emergency line</option>
          </select>
        </label>
      )}
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-widest">
          {kind === "vet" ? "What is going on with the pet" : "Anything we should know"}
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 font-mono text-sm outline-none focus:bg-mustard/20"
          placeholder={
            kind === "vet"
              ? "Kitten not eating since morning, 4 months old"
              : "I want to see the cream Persian male"
          }
        />
      </label>
      {state === "error" && (
        <p className="border-2 border-red-dark bg-red/10 px-3 py-2 font-mono text-sm text-red-dark">{error}</p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="border-2 border-ink bg-red px-5 py-2.5 font-display text-paper hover:bg-ink disabled:opacity-60"
      >
        {state === "sending" ? "SENDING…" : kind === "vet" ? "REQUEST THE VET" : "SEND"}
      </button>
    </form>
  );
}
