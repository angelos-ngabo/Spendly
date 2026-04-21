import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDisplayDate(isoDate: string) {
  const d = parseISO(isoDate)
  return isValid(d) ? format(d, 'MMM d, yyyy') : isoDate
}

export function formatShortDate(isoDate: string) {
  const d = parseISO(isoDate)
  return isValid(d) ? format(d, 'MMM d') : isoDate
}

export function formatMonthYear(monthKey: string) {
  const d = parseISO(`${monthKey}-01`)
  return isValid(d) ? format(d, 'MMM yyyy') : monthKey
}

export function relativeTime(iso: string) {
  const d = parseISO(iso)
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : ''
}
