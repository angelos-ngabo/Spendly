/**
 * Laptop-only vector for cross-device section (Spendly dashboard in screen).
 * Phone is rendered separately — see `CrossDeviceDevicesComposite`.
 */
export function CrossDeviceLaptopArt({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 672 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="cd7-screen" x1="112" y1="72" x2="640" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F3F9FD" />
        </linearGradient>
        <linearGradient id="cd7-orb" x1="480" y1="100" x2="620" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#23A6F0" stopOpacity="0.14" />
          <stop offset="1" stopColor="#23A6F0" stopOpacity="0" />
        </linearGradient>
        <pattern id="cd7-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="#23A6F0" fillOpacity="0.06" />
        </pattern>
        <filter id="cd7-shadow" x="-6%" y="-8%" width="112%" height="120%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#0B5A8A" floodOpacity="0.12" />
        </filter>
      </defs>

      <ellipse cx="320" cy="332" rx="260" ry="24" fill="#23A6F0" fillOpacity="0.05" />
      <circle cx="520" cy="110" r="80" fill="url(#cd7-orb)" />

      <path d="M96 312h520l24 36H72l24-36Z" fill="#252B42" fillOpacity="0.07" />
      <path d="M108 316h496l14 24H94l14-24Z" fill="#252B42" fillOpacity="0.05" />

      <g filter="url(#cd7-shadow)">
        <rect x="64" y="36" width="584" height="276" rx="18" fill="#E4E4E4" />
        <rect x="72" y="44" width="568" height="260" rx="14" fill="#252B42" fillOpacity="0.04" />
        <rect x="80" y="52" width="552" height="244" rx="10" fill="#1A1D21" fillOpacity="0.05" />
        <rect x="88" y="60" width="536" height="228" rx="8" fill="url(#cd7-screen)" />
        <rect x="88" y="60" width="536" height="228" rx="8" fill="url(#cd7-dots)" opacity="0.35" />

        <rect x="88" y="60" width="536" height="34" rx="8" fill="#FFFFFF" fillOpacity="0.92" />
        <line x1="88" y1="93" x2="624" y2="93" stroke="#EAEAEA" strokeWidth="1" />
        <rect x="100" y="70" width="20" height="20" rx="5" fill="#23A6F0" />
        <text x="126" y="85" fill="#252B42" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">
          Spendly
        </text>
        <text x="396" y="84" fill="#737373" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">
          Dashboard
        </text>
        <text x="476" y="84" fill="#9A9A9A" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
          Transactions
        </text>
        <text x="566" y="84" fill="#9A9A9A" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
          Analytics
        </text>

        <text x="100" y="118" fill="#252B42" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">
          Overview
        </text>
        <text x="100" y="134" fill="#737373" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
          This month at a glance
        </text>

        <rect x="100" y="144" width="248" height="124" rx="12" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="1" />
        <text x="116" y="166" fill="#737373" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
          Total balance
        </text>
        <text x="116" y="192" fill="#252B42" fontSize="22" fontWeight="800" fontFamily="system-ui, sans-serif">
          $4,280
        </text>
        <text x="216" y="192" fill="#2E7D32" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">
          +12%
        </text>
        <rect x="116" y="204" width="20" height="44" rx="4" fill="#23A6F0" fillOpacity="0.35" />
        <rect x="142" y="216" width="20" height="32" rx="4" fill="#23A6F0" fillOpacity="0.5" />
        <rect x="168" y="200" width="20" height="48" rx="4" fill="#1A8FD4" fillOpacity="0.65" />
        <rect x="194" y="212" width="20" height="36" rx="4" fill="#23A6F0" fillOpacity="0.4" />
        <rect x="220" y="208" width="20" height="40" rx="4" fill="#0B5A8A" fillOpacity="0.25" />

        <rect x="360" y="144" width="248" height="124" rx="12" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="1" />
        <text x="376" y="166" fill="#252B42" fontSize="9" fontWeight="800" fontFamily="system-ui, sans-serif">
          Recent activity
        </text>
        <rect x="376" y="176" width="216" height="22" rx="6" fill="#FAFAFA" />
        <circle cx="388" cy="187" r="4" fill="#23A6F0" fillOpacity="0.45" />
        <text x="400" y="190" fill="#252B42" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
          Coffee · Dining
        </text>
        <text x="576" y="190" fill="#252B42" fontSize="8" fontWeight="800" fontFamily="system-ui, sans-serif" textAnchor="end">
          −$6
        </text>
        <rect x="376" y="204" width="216" height="22" rx="6" fill="#FAFAFA" />
        <circle cx="388" cy="215" r="4" fill="#2E7D32" fillOpacity="0.5" />
        <text x="400" y="218" fill="#252B42" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
          Salary · Income
        </text>
        <text x="576" y="218" fill="#2E7D32" fontSize="8" fontWeight="800" fontFamily="system-ui, sans-serif" textAnchor="end">
          +$2.4k
        </text>
        <rect x="376" y="232" width="216" height="22" rx="6" fill="#FAFAFA" />
        <circle cx="388" cy="243" r="4" fill="#23A6F0" fillOpacity="0.35" />
        <text x="400" y="246" fill="#252B42" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
          Rent · Housing
        </text>
        <text x="576" y="246" fill="#252B42" fontSize="8" fontWeight="800" fontFamily="system-ui, sans-serif" textAnchor="end">
          −$1.1k
        </text>
      </g>
    </svg>
  )
}
