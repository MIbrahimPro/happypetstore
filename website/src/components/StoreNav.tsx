"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";

/**
 * Store navigation pills with a real active state (client component so it can
 * read the pathname). Mobile row is horizontally scrollable with momentum,
 * 40px+ tap targets, and hover styles gated behind (hover: hover) so nothing
 * sticks after a tap on touch screens.
 */
export function StoreNavDesktop() {
  const path = usePathname();
  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
      {NAV.map((item) => {
        const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`nav-pill hidden px-4 py-2 font-round text-sm font-semibold md:inline-flex ${
              active ? "active" : ""
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function StoreNavMobile() {
  const path = usePathname();
  return (
    <nav
      className="-mx-4 flex items-center gap-1.5 overflow-x-auto px-4 pb-2 pt-0.5 md:hidden"
      aria-label="Main"
      style={{ scrollbarWidth: "none" }}
    >
      {NAV.map((item) => {
        const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`nav-pill shrink-0 px-4 py-2.5 font-round text-[13px] font-semibold ${
              active ? "active" : ""
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
