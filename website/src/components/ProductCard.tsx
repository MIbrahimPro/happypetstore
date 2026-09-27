import Link from "next/link";
import { formatPKR } from "@/lib/utils";
import AddToCart from "@/components/AddToCart";

type Props = {
  p: {
    slug: string;
    name: string;
    brand?: string;
    category: string;
    petTypes?: string[];
    price: number;
    oldPrice?: number;
    unit: string;
    stock: number;
    image: string;
    blurb?: string;
  };
};

const CAT_LABEL: Record<string, string> = {
  food: "Food",
  accessories: "Accessories",
  toys: "Toys",
  litter: "Litter",
  grooming: "Grooming",
  pharmacy: "Pharmacy",
};

export default function ProductCard({ p }: Props) {
  const out = p.stock <= 0;
  return (
    <article className="group border-2 border-ink bg-white hardshadow hover:bg-bone/40 transition-colors">
      <Link href={`/product/${p.slug}`} className="block border-b-2 border-ink">
        <div className="relative aspect-4/3 overflow-hidden bg-bone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span className="absolute left-0 top-3 bg-ink px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest text-paper">
            {CAT_LABEL[p.category] ?? p.category}
          </span>
          {out && (
            <span className="absolute right-0 top-3 bg-ink px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest text-paper">
              Ask us
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-steel">{p.brand}</p>
        <h3 className="mt-1 font-display text-lg leading-tight">
          <Link href={`/product/${p.slug}`} className="hover:text-red">
            {p.name}
          </Link>
        </h3>
        {p.blurb && <p className="mt-1.5 text-sm text-ink/70">{p.blurb}</p>}

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="font-display text-xl">
              {formatPKR(p.price)}
              <span className="ml-1 font-mono text-[11px] uppercase tracking-widest text-steel">
                / {p.unit}
              </span>
            </p>
            {p.oldPrice && p.oldPrice > p.price ? (
              <p className="font-mono text-xs text-steel line-through">{formatPKR(p.oldPrice)}</p>
            ) : null}
          </div>
          <AddToCart
            item={{
              slug: p.slug,
              name: p.name,
              price: p.price,
              image: p.image,
              unit: p.unit,
            }}
            disabled={out}
          />
        </div>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-steel">
          {out ? "Order on call, lands in 1 day" : p.stock <= 3 ? `Only ${p.stock} left` : `${p.stock} in stock`}
        </p>
      </div>
    </article>
  );
}
