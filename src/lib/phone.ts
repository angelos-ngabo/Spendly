/** Strip to digits only. */
export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

/**
 * Build E.164 from dial code (e.g. "+250") and national number (digits only, no leading 0 in some regions).
 */
export function toE164(dialCode: string, nationalDigits: string): string {
  const cc = digitsOnly(dialCode)
  const nn = digitsOnly(nationalDigits)
  if (!cc || !nn) return ''
  return `+${cc}${nn}`
}

/** Basic E.164 length check (ITU: max 15 digits total after +). */
export function isPlausibleE164(e164: string) {
  const d = digitsOnly(e164)
  if (d.length < 8 || d.length > 15) return false
  return e164.startsWith('+')
}
