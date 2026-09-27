/**
 * The wordmark rebuilt to match the real signboard lockup:
 * the traced script "Tails" (their own lettering) sits on top with the dog,
 * and "Happy" — red, letterspaced caps — tucks below-left, like the billboard.
 * No underline bar: on the real sign the red belongs to the HAPPY letters.
 * onNight: amber Happy for dark surfaces, deep collar red on light.
 */
export default function Wordmark({
  onNight = false,
  scriptHeight = 30,
  className = "",
}: {
  onNight?: boolean;
  scriptHeight?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex flex-col items-start ${className}`}
      style={{ fontSize: scriptHeight }}
      role="img"
      aria-label="Happy Tails"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/script-tails.svg"
        alt=""
        style={{ height: scriptHeight, width: "auto" }}
        className={onNight ? "invert" : ""}
      />
      <span
        aria-hidden="true"
        className="-mt-[0.1em] pl-[0.06em] font-display text-[0.4em] font-bold uppercase leading-none tracking-[0.34em]"
        style={{ color: onNight ? "var(--amber)" : "var(--collardeep)" }}
      >
        Happy
      </span>
    </span>
  );
}
