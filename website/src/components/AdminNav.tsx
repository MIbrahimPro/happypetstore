"use client";
import { BASE } from "@/lib/base";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/stock", label: "Stock" },
  { href: "/admin/bookings", label: "Bookings" },
];

export default function AdminNav({ authed }: { authed: boolean }) {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch(BASE + "/api/admin/login", { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  if (!authed) return null;

  return (
    <nav className="flex flex-wrap gap-1 px-3 py-3 lg:flex-col">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-full px-3.5 py-2 font-round text-sm font-semibold ${
              active ? "bg-amber text-night" : "text-bone/85 hover:bg-bone/10 hover:text-bone"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
      <button
        onClick={logout}
        className="mt-2 rounded-full px-3.5 py-2 text-left font-round text-xs font-semibold uppercase tracking-widest text-bone/85 hover:text-collarlight"
      >
        Log out
      </button>
    </nav>
  );
}
