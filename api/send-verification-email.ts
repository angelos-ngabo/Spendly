import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { applyCors } from './_lib/cors'
import { emailVerificationHtml } from './_lib/email-templates'
import { getFirebaseAdmin } from './_lib/firebase-admin'
import { publicAppOrigin } from './_lib/public-origin'
import { clientIp, rateLimitOrThrow } from './_lib/rate-limit'

const SIGN_IN_PATH = '/sign-in'

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

  const authHeader = req.headers.authorization
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!token) {
    res.status(401).json({ error: 'Missing authorization' })
    return
  }

  let email: string
  const admin = getFirebaseAdmin()
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    if (!decoded.email) {
      res.status(400).json({ error: 'Invalid token' })
      return
    }
    email = decoded.email
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
    return
  }

  const origin = publicAppOrigin()
  if (!origin) {
    res.status(503).json({ error: 'PUBLIC_APP_ORIGIN is not configured.' })
    return
  }

  const continueUrl = `${origin}${SIGN_IN_PATH}`
  const actionCodeSettings = { url: continueUrl, handleCodeInApp: false as const }

  let verifyLink: string
  try {
    verifyLink = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings)
  } catch (e) {
    console.error('generateEmailVerificationLink', e)
    res.status(502).json({ error: 'Could not create verification link.' })
    return
  }

  const from = process.env.RESEND_FROM_EMAIL?.trim() || 'Spendly <onboarding@resend.dev>'
  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from,
      to: email,
      subject: 'Verify your Spendly email',
      html: emailVerificationHtml({ verifyUrl: verifyLink, email }),
    })
  } catch (e) {
    console.error('Resend verification error', e)
    res.status(502).json({ error: 'Could not send email. Try again later.' })
    return
  }

  res.status(200).json({ ok: true })
}
