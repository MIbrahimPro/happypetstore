type LogoProps = {
  variant?: "horizontal" | "stacked" | "mark";
  className?: string;
  title?: string;
};

function Mark({ title }: { title?: string }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={title ?? "Happy Tails mark"}>
      {title ? <title>{title}</title> : null}
      <rect width="64" height="64" fill="#D6342C" />
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
  );
}

function Wordmark({ stacked }: { stacked?: boolean }) {
  return (
    <g>
      <text
        x={0}
        y={stacked ? 34 : 58}
        fontFamily="'Archivo Black','Arial Black',sans-serif"
        fontSize={stacked ? 30 : 40}
        letterSpacing="1"
        fill="#1D1B16"
      >
        HAPPY
      </text>
      <text
        x={stacked ? 2 : 158}
        y={stacked ? 62 : 58}
        fontFamily="'Archivo Black','Arial Black',sans-serif"
        fontSize={stacked ? 30 : 40}
        letterSpacing="1"
        fill="#D6342C"
      >
        TAILS
      </text>
    </g>
  );
}

export default function Logo({ variant = "horizontal", className, title }: LogoProps) {
  if (variant === "mark") {
    return (
      <span className={className}>
        <Mark title={title} />
      </span>
    );
  }
  if (variant === "stacked") {
    return (
      <svg viewBox="0 0 150 110" className={className} role="img" aria-label={title ?? "Happy Tails"}>
        {title ? <title>{title}</title> : null}
        <g transform="translate(10,0)">
          <Mark title={undefined as unknown as string} />
        </g>
        <g transform="translate(8,52)">
          <Wordmark stacked />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 250 64" className={className} role="img" aria-label={title ?? "Happy Tails"}>
      {title ? <title>{title}</title> : null}
      <g>
        <Mark title={undefined as unknown as string} />
      </g>
      <g transform="translate(72,0)">
        <Wordmark />
      </g>
    </svg>
  );
}
