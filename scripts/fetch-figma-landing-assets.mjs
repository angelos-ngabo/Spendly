/**
 * Downloads laptop + phone PNG exports from a Figma file into public/landing/devices/
 *
 * Prerequisites:
 * 1. Figma → Settings → Security → Generate personal access token
 * 2. Open your file in Figma, select the laptop frame → Copy link → node-id=123-456 → use 123:456
 *
 * Usage (PowerShell):
 *   $env:FIGMA_ACCESS_TOKEN="your_token"
 *   $env:FIGMA_FILE_KEY="d5OZq7V9y5AjJ4AijwMtJ1"
 *   $env:FIGMA_LAPTOP_NODE_ID="3:87"
 *   $env:FIGMA_PHONE_NODE_ID="3:88"
 *   node scripts/fetch-figma-landing-assets.mjs
 *
 * @see https://www.figma.com/developers/api#get-images-endpoint
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outDir = path.join(root, 'public', 'landing', 'devices')

const token = process.env.FIGMA_ACCESS_TOKEN
const fileKey = process.env.FIGMA_FILE_KEY || 'd5OZq7V9y5AjJ4AijwMtJ1'
const laptopId = process.env.FIGMA_LAPTOP_NODE_ID
const phoneId = process.env.FIGMA_PHONE_NODE_ID

function usage() {
  console.error(`
fetch-figma-landing-assets

Set environment variables:
  FIGMA_ACCESS_TOKEN   (required) Personal access token from Figma
  FIGMA_FILE_KEY       (optional) File key from figma.com/design/<KEY>/...
                       Default: d5OZq7V9y5AjJ4AijwMtJ1 (Resizable Mockups community)
  FIGMA_LAPTOP_NODE_ID (required) e.g. 3:87  (from URL node-id=3-87 → 3:87)
  FIGMA_PHONE_NODE_ID  (required) e.g. 3:88  (phone mockup node in the same file)

Writes:
  public/landing/devices/laptop.png
  public/landing/devices/phone.png
`)
}

if (!token) {
  usage()
  console.error('Error: FIGMA_ACCESS_TOKEN is missing.')
  process.exit(1)
}
if (!laptopId || !phoneId) {
  usage()
  console.error('Error: FIGMA_LAPTOP_NODE_ID and FIGMA_PHONE_NODE_ID are required.')
  process.exit(1)
}

const ids = `${laptopId},${phoneId}`
const apiUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=png&scale=2`

const res = await fetch(apiUrl, {
  headers: { 'X-Figma-Token': token },
})

if (!res.ok) {
  const body = await res.text()
  console.error(`Figma API error ${res.status}:`, body.slice(0, 500))
  process.exit(1)
}

/** @type {{ images: Record<string, string | null>, err?: string }} */
const json = await res.json()
if (json.err) {
  console.error('Figma API:', json.err)
  process.exit(1)
}

const laptopUrl = json.images[laptopId]
const phoneUrl = json.images[phoneId]
if (!laptopUrl || !phoneUrl) {
  console.error('Missing image URL in response. Check node IDs exist in the file.', json.images)
  process.exit(1)
}

fs.mkdirSync(outDir, { recursive: true })

async function download(url, filename) {
  const imgRes = await fetch(url)
  if (!imgRes.ok) {
    throw new Error(`Download failed ${imgRes.status} for ${filename}`)
  }
  const buf = Buffer.from(await imgRes.arrayBuffer())
  const dest = path.join(outDir, filename)
  fs.writeFileSync(dest, buf)
  console.log('Wrote', path.relative(root, dest), `(${(buf.length / 1024).toFixed(1)} KB)`)
}

await download(laptopUrl, 'laptop.png')
await download(phoneUrl, 'phone.png')
console.log('\nDone. Restart dev server if running; the landing page will pick up these files automatically.')
