/**
 * Brand mark sourced from the client's own art, traced into SVG layers.
 * <img src="/brand/logo-mark.svg"> has a fixed night ring, so for dark
 * surfaces we keep the same file: its ring simply blends into the night bg.
 * onNight is therefore only about drop-shadow softness.
 */
export default function Logo({
  className = "",
  onNight = false,
}: {
  className?: string;
  onNight?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo-mark.svg"
      alt="Happy Tails dog mark"
      className={className}
      style={onNight ? { filter: "drop-shadow(0 4px 14px rgba(250,246,238,0.08))" } : undefined}
    />
  );
}
