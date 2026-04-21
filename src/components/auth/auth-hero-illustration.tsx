import { cn } from '@/lib/utils'

/**
 * Local vector hero (Figma export unavailable when API is rate-limited).
 * Uses CSS variables so Spendly light/dark themes stay consistent.
 */
export function AuthHeroIllustration({
  variant,
  className,
}: {
  variant: 'sign-in' | 'sign-up'
  className?: string
}) {
  const otpAccent = variant === 'sign-in' ? 'var(--chart-3)' : 'var(--primary)'

  return (
    <svg
      viewBox="0 0 420 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full max-w-[min(100%,22rem)] select-none', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="authHeroGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--chart-5)" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <circle cx="210" cy="170" r="150" fill="url(#authHeroGlow)" />
      <rect
        x="118"
        y="72"
        width="184"
        height="248"
        rx="28"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        fill="rgba(255,255,255,0.12)"
      />
      <rect
        x="138"
        y="96"
        width="144"
        height="196"
        rx="18"
        fill="rgba(255,255,255,0.95)"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1"
      />
      <rect x="158" y="118" width="104" height="12" rx="6" fill="var(--primary)" fillOpacity="0.22" />
      <rect x="158" y="142" width="72" height="10" rx="5" fill="var(--muted-foreground)" fillOpacity="0.22" />
      <rect x="158" y="164" width="88" height="10" rx="5" fill="var(--muted-foreground)" fillOpacity="0.18" />
      <rect x="158" y="198" width="104" height="44" rx="12" fill={otpAccent} fillOpacity="0.88" />
      <path
        d="M178 218h64M178 228h40"
        stroke="var(--foreground)"
        strokeOpacity="0.22"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g transform="translate(268 188)">
        <circle r="22" fill="rgba(255,255,255,0.92)" stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="2" />
        <circle cx="-6" cy="-2" r="4" fill="var(--primary)" />
        <circle cx="6" cy="-2" r="4" fill="var(--primary)" />
        <circle cx="-6" cy="8" r="4" fill="var(--primary)" />
        <circle cx="6" cy="8" r="4" fill="var(--primary)" />
      </g>
      <text
        x="210"
        y="312"
        textAnchor="middle"
        fill="rgba(255,255,255,0.55)"
        className="text-[11px] font-semibold tracking-wide"
        style={{ fontFamily: 'inherit' }}
      >
        Secure verification
      </text>
    </svg>
  )
}
