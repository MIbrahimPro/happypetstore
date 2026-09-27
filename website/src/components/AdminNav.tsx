"use client";

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
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  if (!authed) return null;

  return (
    <nav className="flex flex-wrap gap-0 px-2 py-3 lg:flex-col">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-2 font-mono text-sm uppercase tracking-widest ${
              active ? "bg-red text-paper" : "text-paper/70 hover:bg-paper/10"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
      <button
        onClick={logout}
        className="mt-2 px-3 py-2 text-left font-mono text-xs uppercase tracking-widest text-paper/40 hover:text-red"
      >
        Log out
      </button>
    </nav>
  );
}
