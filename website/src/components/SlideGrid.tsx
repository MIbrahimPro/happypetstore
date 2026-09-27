type Props = {
  images: { src: string; label?: string }[];
};

const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0", "-rotate-1"];

export default function SlideGrid({ images }: Props) {
  const list = images.length ? images : [{ src: "/images/pets/kitten-1.jpg", label: "The shop cats" }];

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
      {list.slice(0, 6).map((img, i) => (
        <figure
          key={img.src + i}
          className={`${rotations[i % rotations.length]} overflow-hidden rounded-blob bg-white p-2 shadow-soft transition-transform duration-500 hover:rotate-0 hover:scale-[1.03]`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={img.label ?? "Shop photo"}
            loading="lazy"
            className="h-40 w-full rounded-[1.2rem] object-cover"
          />
          {img.label && (
            <figcaption className="py-1.5 text-center font-round text-[11px] font-semibold leading-snug text-night/80">
              {img.label}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
