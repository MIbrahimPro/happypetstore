import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">Shelf not found</p>
      <h1 className="mt-3 font-display text-5xl">
        THIS AISLE IS <span className="text-red">EMPTY.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-md text-ink/70">
        The page moved or never existed. The animals are still at Ramna Plaza, and the phone
        still works around the clock.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/shop" className="border-2 border-ink bg-red px-5 py-2.5 font-display text-paper hardshadow">
          TO THE SHOP
        </Link>
        <Link href="/" className="border-2 border-ink bg-paper px-5 py-2.5 font-display hardshadow">
          HOME
        </Link>
      </div>
    </div>
  );
}
