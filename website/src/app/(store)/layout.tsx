import Link from "next/link";
import { SITE, telLink } from "@/lib/site";
import CartButton from "@/components/CartButton";
import TickTag from "@/components/TickTag";
import { CartProvider } from "@/components/CartProvider";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/adopt", label: "Adopt" },
  { href: "/clinic", label: "Clinic" },
  { href: "/about", label: "Visit" },
];

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
        <div className="flex min-h-screen flex-col">
          {/* Ticker bar: plain text, real shop facts */}
          <div className="bg-ink text-paper">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 font-mono text-xs">
              <span>{SITE.hours}</span>
              <span className="hidden sm:inline">{SITE.addressShort}</span>
              <a href={telLink()} className="penlink text-mustard decoration-mustard">
                {SITE.phone}
              </a>
            </div>
          </div>

          <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
            <div className="mx-auto flex max-w-6xl items-stretch justify-between px-4">
              <Link href="/" className="flex items-center gap-3 py-3">
                <span className="inline-flex h-10 w-10 items-center justify-center bg-red">
                  <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
                    <path
                      d="M13 45 C9 35 15 25 25 25 C31 25 35 29 35 35 C35 40 31 43 27 43"
                      fill="none"
                      stroke="#F5EFDF"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M36 18 L42 11 L44.5 19.5 C52.5 21.5 55 30 51 36 L53.5 44.5 C45 50.5 34.5 48.5 30.5 40 C26.5 31.5 30.5 21.5 36 18 Z"
                      fill="#F5EFDF"
                    />
                    <circle cx="41" cy="30" r="2.6" fill="#1D1B16" />
                    <path d="M44 36 q3 2.5 6 0" fill="none" stroke="#1D1B16" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M40.5 39 L40.5 44 M44 38.5 L44 44" stroke="#1D1B16" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="leading-none">
                  <span className="block font-display text-2xl tracking-tight">HAPPY</span>
                  <span className="block font-display text-2xl tracking-tight text-red -mt-1.5">TAILS</span>
                </span>
              </Link>

              <nav className="flex items-stretch">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center border-l-2 border-ink px-3 font-display text-sm hover:bg-ink hover:text-paper sm:px-4"
                  >
                    {item.label}
                  </Link>
                ))}
                <CartButton />
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t-2 border-ink bg-ink text-paper">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-display text-2xl">
                  HAPPY<span className="text-red">TAILS</span>
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-paper/70">
                  Pet store and clinic, 24/7
                </p>
              </div>
              <div className="font-mono text-sm">
                <p className="text-mustard">CALL ANY HOUR</p>
                <a href={telLink()} className="penlink text-paper decoration-mustard mt-1 inline-block">
                  {SITE.phone}
                </a>
                <p className="mt-3 text-paper/70">WhatsApp the same number</p>
              </div>
              <div className="font-mono text-sm">
                <p className="text-mustard">WALK IN</p>
                <p className="mt-1 text-paper/80">{SITE.address}</p>
              </div>
              <div className="font-mono text-sm">
                <p className="text-mustard">PAGES</p>
                <ul className="mt-1 space-y-1">
                  {NAV.map((n) => (
                    <li key={n.href}>
                      <Link href={n.href} className="penlink text-paper decoration-mustard">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/admin" className="penlink text-paper decoration-mustard">
                      Staff login
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-paper/20">
              <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 font-mono text-[11px] text-paper/60">
                <span>Happy Tails Pet Store and Clinic, Islamabad</span>
                <TickTag />
              </div>
            </div>
          </footer>
      </div>
    </CartProvider>
  );
}
