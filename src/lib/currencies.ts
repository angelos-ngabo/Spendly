export const DISPLAY_CURRENCIES = ['RWF', 'USD', 'EUR', 'GBP', 'KES', 'UGX', 'CAD'] as const

export type DisplayCurrencyCode = (typeof DISPLAY_CURRENCIES)[number]

const SET = new Set<string>(DISPLAY_CURRENCIES)

export function isDisplayCurrencyCode(value: string): value is DisplayCurrencyCode {
  return SET.has(value as DisplayCurrencyCode)
}

export function parseDisplayCurrencyCode(raw: unknown): DisplayCurrencyCode | null {
  if (typeof raw !== 'string') return null
  const u = raw.trim().toUpperCase()
  return isDisplayCurrencyCode(u) ? u : null
}

export const DISPLAY_CURRENCY_LABELS: Record<DisplayCurrencyCode, string> = {
  RWF: 'Rwandan franc (RWF)',
  USD: 'US dollar (USD)',
  EUR: 'Euro (EUR)',
  GBP: 'British pound (GBP)',
  KES: 'Kenyan shilling (KES)',
  UGX: 'Ugandan shilling (UGX)',
  CAD: 'Canadian dollar (CAD)',
}
