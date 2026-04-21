/** Tailwind-based badge styles and hex colors for charts — indexed by stable hash. */
export const CATEGORY_STYLE_RING = [
  {
    badge:
      'border-violet-500/25 bg-violet-500/10 text-violet-800 dark:text-violet-200',
    chart: '#7c3aed',
  },
  {
    badge: 'border-sky-500/25 bg-sky-500/10 text-sky-800 dark:text-sky-200',
    chart: '#0284c7',
  },
  {
    badge:
      'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200',
    chart: '#059669',
  },
  {
    badge: 'border-amber-500/25 bg-amber-500/10 text-amber-900 dark:text-amber-200',
    chart: '#d97706',
  },
  {
    badge: 'border-rose-500/25 bg-rose-500/10 text-rose-800 dark:text-rose-200',
    chart: '#e11d48',
  },
  {
    badge:
      'border-cyan-500/25 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200',
    chart: '#0891b2',
  },
  {
    badge:
      'border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-800 dark:text-fuchsia-200',
    chart: '#c026d3',
  },
  {
    badge: 'border-lime-500/25 bg-lime-500/10 text-lime-900 dark:text-lime-200',
    chart: '#65a30d',
  },
  {
    badge:
      'border-orange-500/25 bg-orange-500/10 text-orange-900 dark:text-orange-200',
    chart: '#ea580c',
  },
  {
    badge: 'border-teal-500/25 bg-teal-500/10 text-teal-800 dark:text-teal-200',
    chart: '#0d9488',
  },
] as const

export function hashString(input: string) {
  let h = 0
  for (let i = 0; i < input.length; i += 1) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function styleForCategory(category: string) {
  const idx = hashString(category) % CATEGORY_STYLE_RING.length
  return CATEGORY_STYLE_RING[idx]!
}
