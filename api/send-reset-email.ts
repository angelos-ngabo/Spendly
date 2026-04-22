import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { applyCors } from './_lib/cors'
import { passwordResetHtml } from './_lib/email-templates'
import { getFirebaseAdmin } from './_lib/firebase-admin'
import { publicAppOrigin } from './_lib/public-origin'
import { clientIp, rateLimitOrThrow } from './_lib/rate-limit'

const RESET_PATH = '/reset-password'

function isValidEmail(email: string): boolean {
  const t = email.trim()
  if (t.length > 254 || t.length < 3) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    rateLimitOrThrow(clientIp(req))
  } catch (e) {
    const code = (e as Error & { statusCode?: number }).statusCode
    res.status(code ?? 429).json({ error: 'Too many requests. Try again later.' })
    return
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey?.trim()) {
    res.status(503).json({ error: 'Email service is not configured.' })
    return
  }

  let body: { email?: string }
  try {
    body = typeof req.body === 'string' ? (JSON.parse(req.body) as { email?: string }) : (req.body as { email?: string })
  } catch {
    res.status(400).json({ error: 'Invalid JSON' })
    return
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!email || !isValidEmail(email)) {
    res.status(200).json({ ok: true })
    return
  }

  const origin = publicAppOrigin()
  if (!origin) {
    res.status(503).json({ error: 'PUBLIC_APP_ORIGIN is not configured.' })
    return
  }

  const continueUrl = `${origin}${RESET_PATH}`
  const actionCodeSettings = { url: continueUrl, handleCodeInApp: false as const }

  let resetLink: string
  try {
    const admin = getFirebaseAdmin()
    resetLink = await admin.auth().generatePasswordResetLink(email, actionCodeSettings)
  } catch {
    res.status(200).json({ ok: true })
    return
  }

  const from = process.env.RESEND_FROM_EMAIL?.trim() || 'Spendly <onboarding@resend.dev>'
  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from,
      to: email,
      subject: 'Reset your Spendly password',
      html: passwordResetHtml({ resetUrl: resetLink, email }),
    })
  } catch (e) {
    console.error('Resend password reset error', e)
    res.status(502).json({ error: 'Could not send email. Try again later.' })
    return
  }

  res.status(200).json({ ok: true })
}
