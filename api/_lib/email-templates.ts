const brandBlue = '#23A6F0'
const text = '#252B42'
const muted = '#737373'
const bg = '#FAFAFA'

function shell(inner: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Spendly</title>
</head>
<body style="margin:0;padding:0;background:${bg};font-family:Segoe UI,system-ui,-apple-system,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #EAEAEA;box-shadow:0 8px 24px rgba(0,0,0,0.06);overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 8px 28px;">
              <div style="font-size:20px;font-weight:800;color:${text};letter-spacing:-0.02em;">Spendly</div>
              <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${muted};margin-top:4px;">Personal finance</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 32px 28px;color:${text};font-size:15px;line-height:1.55;">
              ${inner}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px 28px;font-size:12px;color:${muted};line-height:1.5;">
              If you did not request this, you can ignore this message. This inbox is not monitored.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function passwordResetHtml(params: { resetUrl: string; email: string }) {
  const { resetUrl, email } = params
  const inner = `
    <h1 style="margin:16px 0 8px 0;font-size:22px;font-weight:800;color:${text};">Reset your password</h1>
    <p style="margin:0 0 16px 0;color:${muted};">We received a request for <strong style="color:${text};">${escapeHtml(
      email,
    )}</strong>. Use the button below to choose a new password. This link expires for your security.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td align="center" style="border-radius:10px;background:${brandBlue};">
          <a href="${hrefAttr(
            resetUrl,
          )}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:10px;">Reset password</a>
        </td>
      </tr>
    </table>
    <p style="margin:16px 0 0 0;font-size:12px;color:${muted};">If the button does not work, copy and paste this link into your browser:</p>
    <p style="margin:6px 0 0 0;font-size:11px;word-break:break-all;color:${brandBlue};">${escapeHtml(resetUrl)}</p>
  `
  return shell(inner)
}

export function emailVerificationHtml(params: { verifyUrl: string; email: string }) {
  const { verifyUrl, email } = params
  const inner = `
    <h1 style="margin:16px 0 8px 0;font-size:22px;font-weight:800;color:${text};">Verify your email</h1>
    <p style="margin:0 0 16px 0;color:${muted};">Confirm <strong style="color:${text};">${escapeHtml(
      email,
    )}</strong> for your Spendly account. Tap the button to finish verification.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td align="center" style="border-radius:10px;background:${brandBlue};">
          <a href="${hrefAttr(
            verifyUrl,
          )}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:10px;">Verify email</a>
        </td>
      </tr>
    </table>
    <p style="margin:16px 0 0 0;font-size:12px;color:${muted};">If the button does not work, copy and paste this link into your browser:</p>
    <p style="margin:6px 0 0 0;font-size:11px;word-break:break-all;color:${brandBlue};">${escapeHtml(verifyUrl)}</p>
  `
  return shell(inner)
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function hrefAttr(url: string) {
  return url.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}
