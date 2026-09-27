type Props = {
  images: { src: string; label?: string }[];
};

export default function SlideGrid({ images }: Props) {
  const list = images.length ? images : [{ src: "/images/pets/kitten-1.jpg", label: "The shop cats" }];
  const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "rotate-0", "-rotate-1"];

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
      {list.slice(0, 6).map((img, i) => (
        <figure key={img.src + i} className={`sticker ${rotations[i % rotations.length]}`}>
          <div className="border border-ink/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.label ?? "Shop photo"} loading="lazy" className="h-40 w-full object-cover" />
          </div>
          {img.label && (
            <figcaption className="mt-1.5 pb-1 text-center font-mono text-[11px] uppercase tracking-widest text-ink/70">
              {img.label}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
