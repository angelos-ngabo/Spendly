import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'
import type { DisplayCurrencyCode } from '@/lib/currencies'

/** Whole-unit display for high-denomination currencies (formatting only; amounts are not converted). */
function fractionDigitsForCurrency(currency: string): { min: number; max: number } {
  if (currency === 'RWF' || currency === 'UGX') return { min: 0, max: 0 }
  return { min: 2, max: 2 }
}

export function formatCurrency(amount: number, currency: DisplayCurrencyCode | string = 'USD') {
  const code = typeof currency === 'string' && currency ? currency : 'USD'
  const { min, max } = fractionDigitsForCurrency(code)
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: min,
    maximumFractionDigits: max,
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
