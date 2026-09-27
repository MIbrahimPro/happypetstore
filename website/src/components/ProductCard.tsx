import { asset } from "@/lib/base";
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
    <article className="softcard group flex h-full flex-col overflow-hidden">
      <Link href={`/product/${p.slug}`} className="block">
        {/* fixed-height photo band: portrait uploads crop, never stretch the card */}
        <div className="relative h-44 overflow-hidden bg-[#efe9dc]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(p.image)}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-night/85 px-2.5 py-1 font-round text-[11px] font-semibold text-bone">
            {CAT_LABEL[p.category] ?? p.category}
          </span>
          {out && (
            <span className="absolute right-3 top-3 rounded-full bg-collar px-2.5 py-1 font-round text-[11px] font-bold text-bone">
              Ask us
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="caption font-round text-[11px] uppercase">{p.brand}</p>
        <h3 className="mt-0.5 font-round text-lg font-bold leading-snug">
          <Link href={`/product/${p.slug}`} className="hover:text-turfdeep">
            {p.name}
          </Link>
        </h3>
        {p.blurb && <p className="mt-1 text-sm leading-snug text-night/65">{p.blurb}</p>}

        {/* price + stock pinned to the card bottom so rows stay level */}
        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="font-display text-xl font-bold leading-tight text-night">
                {formatPKR(p.price)}
                <span className="caption ml-1 font-round text-[11px] uppercase">/ {p.unit}</span>
              </p>
              {p.oldPrice && p.oldPrice > p.price ? (
                <p className="font-round text-xs leading-tight text-ink line-through">
                  {formatPKR(p.oldPrice)}
                </p>
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
          <p className="caption mt-1.5 font-round text-[11px] uppercase">
            {out ? "Order on call, lands in 1 day" : p.stock <= 3 ? `Only ${p.stock} left` : `${p.stock} in stock`}
          </p>
        </div>
      </div>
    </article>
  );
}
