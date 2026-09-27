import Link from "next/link";
import { SITE, telLink, waLink } from "@/lib/site";
import CartButton from "@/components/CartButton";
import Logo from "@/components/Logo";
import Wordmark from "@/components/Wordmark";
import PawTrail from "@/components/PawTrail";
import { CartProvider } from "@/components/CartProvider";
import { StoreNavDesktop, StoreNavMobile } from "@/components/StoreNav";
import { NAV } from "@/lib/nav";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <PawTrail />
      <div className="flex min-h-screen flex-col">
        {/* top strip: real shop facts, night fur */}
        <div className="fur-dark text-bone">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 font-round text-xs">
            <span>{SITE.hours}</span>
            <span className="hidden sm:inline text-bone/70">{SITE.addressShort}</span>
            <a href={waLink("Hello Happy Tails!")} target="_blank" rel="noreferrer" className="warm-link text-amber">
              WhatsApp {SITE.phone}
            </a>
          </div>
        </div>

        <header className="sticky top-0 z-40 bg-bone/90 backdrop-blur shadow-softer">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-11 w-auto" />
              <Wordmark scriptHeight={26} />
            </Link>

            <StoreNavDesktop />

            <div className="flex items-center gap-2">
              <a
                href={telLink()}
                className="btn-soft hidden bg-turfdeep text-sm text-bone hover:brightness-110 sm:inline-flex"
              >
                Call any hour
              </a>
              <CartButton />
            </div>
          </div>
          {/* mobile nav */}
          <StoreNavMobile />
        </header>

        <main className="flex-1">{children}</main>

        <footer className="fur-dark text-bone">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Wordmark onNight scriptHeight={34} />
              <p className="mt-3 font-round text-sm text-bone/70">
                Pet store and clinic, open 24/7. The softest ears in G-10.
              </p>
            </div>
            <div className="font-round text-sm">
              <p className="caption text-amber">CALL ANY HOUR</p>
              <a href={telLink()} className="warm-link mt-1 inline-block text-bone">
                {SITE.phone}
              </a>
              <p className="mt-2 text-bone/70">WhatsApp the same number.</p>
            </div>
            <div className="font-round text-sm">
              <p className="caption text-amber">WALK IN</p>
              <p className="mt-1 text-bone/80">{SITE.address}</p>
            </div>
            <div className="font-round text-sm">
              <p className="caption text-amber">PAGES</p>
              <ul className="mt-1 space-y-1">
                {NAV.filter((n) => n.href !== "/").map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="warm-link text-bone/90">
                      {n.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/admin" className="warm-link text-bone/85">
                    Staff login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-bone/15">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 font-round text-xs text-bone/60">
              <span>Happy Tails Pet Store and Clinic, Islamabad</span>
              <TickTag />
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

function TickTag() {
  const year = new Date().getFullYear();
  return <span>{year} / G-10 Markaz / PK</span>;
}
