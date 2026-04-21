import { z } from 'zod'
import { countryByIso } from '@/data/country-dial-codes'
import { isPlausibleE164, toE164 } from '@/lib/phone'

export const signInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Use at least 6 characters'),
})

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Enter your full name')
      .max(120, 'Name is too long'),
    phoneCountryIso: z.string().min(2, 'Select a country'),
    phoneNational: z
      .string()
      .trim()
      .min(6, 'Enter your phone number')
      .max(24, 'Phone number is too long'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Use at least 6 characters'),
    confirm: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })
  .superRefine((data, ctx) => {
    const country = countryByIso(data.phoneCountryIso)
    if (!country) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select a valid country',
        path: ['phoneCountryIso'],
      })
      return
    }
    const e164 = toE164(country.dial, data.phoneNational)
    if (!isPlausibleE164(e164)) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Enter a valid international number (digits only; 8–15 digits total including country code)',
        path: ['phoneNational'],
      })
    }
  })

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>
