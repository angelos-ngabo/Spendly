import { z } from 'zod'

const MIN_LEN = 8

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email'),
})

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(MIN_LEN, `Use at least ${MIN_LEN} characters`)
      .max(128, 'Password is too long'),
    confirm: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
