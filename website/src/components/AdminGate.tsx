"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminGate({ ok }: { ok: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (!ok) router.replace("/admin/login");
  }, [ok, router]);
  return (
    <div className="px-8 py-16 font-round text-sm text-bone/60">
      Checking the keyring…
    </div>
  );
}
