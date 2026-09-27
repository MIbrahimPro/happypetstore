"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/nav";
import { telLink, waLink } from "@/lib/site";

/**
 * Desktop: the same pills as before, hidden under md.
 * Mobile: a hamburger in the header bar that opens a slide-down panel with
 * full-width rows (48px+ targets), the active page marked, and call/WhatsApp
 * actions pinned at the bottom. Panel overlays the page (no layout jump),
 * closes on navigation, Escape, or outside tap, and locks body scroll.
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

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  /* close when a link navigates */
  useEffect(() => setOpen(false), [path]);
  /* lock scroll while open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  /* Escape closes */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-night/5 transition-transform active:scale-90"
      >
        <span className="burger-box" data-open={open} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* slide-down panel; absolute so the page never jumps */}
      <div
        id="mobile-menu"
        className={`absolute right-0 top-full z-50 mt-2 w-72 origin-top-right transition-all duration-200 ease-out ${
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="overflow-hidden rounded-3xl bg-bone shadow-soft ring-1 ring-night/10">
          <ul className="p-2">
            {NAV.map((item) => {
              const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-[48px] items-center justify-between rounded-2xl px-4 font-round text-base font-bold transition-colors ${
                      active ? "bg-night text-amber" : "text-night active:bg-night/5"
                    }`}
                  >
                    {item.label}
                    {active && <span aria-hidden="true">🐾</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-2 border-t border-night/10 p-3">
            <a
              href={telLink()}
              className="btn-soft flex-1 justify-center bg-collardeep px-3 py-2.5 text-sm text-bone"
            >
              Call
            </a>
            <a
              href={waLink("Hello Happy Tails!")}
              target="_blank"
              rel="noreferrer"
              className="btn-soft flex-1 justify-center bg-turfdeep px-3 py-2.5 text-sm text-bone"
            >
              WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
