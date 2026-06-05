/** A simple, crisp Poké Ball mark used in the logo (and matching the favicon). */
export function Pokeball({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Poké Ball"
    >
      <defs>
        <clipPath id="pokeball-clip">
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>
      <g clipPath="url(#pokeball-clip)">
        <rect x="0" y="0" width="64" height="32" fill="#ef4444" />
        <rect x="0" y="32" width="64" height="32" fill="#f8fafc" />
        <rect x="0" y="28" width="64" height="8" fill="#1f2937" />
      </g>
      <circle cx="32" cy="32" r="30" fill="none" stroke="#1f2937" strokeWidth="4" />
      <circle cx="32" cy="32" r="10" fill="#f8fafc" stroke="#1f2937" strokeWidth="4" />
      <circle cx="32" cy="32" r="4" fill="#f8fafc" stroke="#1f2937" strokeWidth="3" />
    </svg>
  );
}
