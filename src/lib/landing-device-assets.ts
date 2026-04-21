const withBase = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

/** Figma-exported mockups in `public/landing/devices/` (see `npm run figma:devices`). */
export const LANDING_DEVICE_LAPTOP = withBase('landing/devices/laptop.png')
export const LANDING_DEVICE_PHONE = withBase('landing/devices/phone.png')

/**
 * Optional high-res phone product PNG (e.g. iPhone-style black frame). When present, cross-device + raster hero
 * prefer this over generic `phone.png`. Add as `public/landing/devices/phone-product.png`.
 */
export const LANDING_DEVICE_PHONE_PRODUCT = withBase('landing/devices/phone-product.png')

/**
 * Primary realistic phone asset for hero + cross-device ("phone icon").
 * Prefer `public/landing/phone-icon.png`. Also supports `public/landing/phone icon.png`.
 */
export const LANDING_DEVICE_PHONE_ICON = withBase('landing/phone-icon.png')
export const LANDING_DEVICE_PHONE_ICON_SPACED = withBase(encodeURI('landing/phone icon.png'))

/** First URL in this list that loads is used for PNG phone visuals (hero, cross-device, raster hero). */
export const LANDING_PHONE_PNG_PROBE_ORDER = [
  LANDING_DEVICE_PHONE_ICON,
  LANDING_DEVICE_PHONE_ICON_SPACED,
  LANDING_DEVICE_PHONE_PRODUCT,
  LANDING_DEVICE_PHONE,
] as const
