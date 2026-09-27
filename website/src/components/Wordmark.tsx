/**
 * The wordmark rebuilt from the client's art:
 * "Happy" in the round display face + the traced script "Tails" (their own
 * lettering, background removed) + a collar-red underline bar.
 * onNight: bone text for dark surfaces. On light, night text.
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
    <span className={`inline-flex items-end gap-[0.35em] ${className}`}>
      <span
        className="font-display font-extrabold leading-none tracking-tight"
        style={{ color: onNight ? "var(--bone)" : "var(--night)" }}
      >
        Happy
      </span>
      <span className="relative inline-flex flex-col items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/script-tails.svg"
          alt="Tails"
          style={{ height: scriptHeight, width: "auto" }}
          className={onNight ? "" : "invert"}
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-[0.28em] left-[6%] h-[0.14em] w-[70%] rounded-full"
          style={{ background: "var(--collar)" }}
        />
      </span>
    </span>
  );
}
