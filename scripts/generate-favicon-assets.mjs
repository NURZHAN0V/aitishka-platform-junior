/**
 * Rasterize public/favicon.svg into favicon / PWA / apple-touch PNGs + ICO.
 * Usage: node scripts/generate-favicon-assets.mjs
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const assetsBrand = join(root, 'src/assets/images/brand')
const svgPath = join(publicDir, 'favicon.svg')
const masterSrc =
  process.env.MASTER_PNG ||
  join(
    process.env.HOME || '',
    '.cursor/projects/Users-nurzhanov-GitHub-book-camp/assets/logo-it-blob-master.png',
  )

mkdirSync(assetsBrand, { recursive: true })

const svg = readFileSync(svgPath)

async function png(size, out) {
  await sharp(svg, { density: Math.max(72, size * 3) })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out)
  console.log('wrote', out, `${size}×${size}`)
}

/** Minimal multi-size ICO from PNG buffers (ICONDIR + ICONDIRENTRY + PNG payloads). */
function buildIco(pngBuffersWithSizes) {
  const count = pngBuffersWithSizes.length
  const headerSize = 6 + count * 16
  let offset = headerSize
  const entries = []
  for (const { size, buffer } of pngBuffersWithSizes) {
    entries.push({ size, buffer, offset })
    offset += buffer.length
  }
  const total = offset
  const out = Buffer.alloc(total)
  out.writeUInt16LE(0, 0)
  out.writeUInt16LE(1, 2)
  out.writeUInt16LE(count, 4)
  let entryPos = 6
  for (const e of entries) {
    const w = e.size >= 256 ? 0 : e.size
    const h = e.size >= 256 ? 0 : e.size
    out.writeUInt8(w, entryPos)
    out.writeUInt8(h, entryPos + 1)
    out.writeUInt8(0, entryPos + 2)
    out.writeUInt8(0, entryPos + 3)
    out.writeUInt16LE(1, entryPos + 4)
    out.writeUInt16LE(32, entryPos + 6)
    out.writeUInt32LE(e.buffer.length, entryPos + 8)
    out.writeUInt32LE(e.offset, entryPos + 12)
    e.buffer.copy(out, e.offset)
    entryPos += 16
  }
  return out
}

const sizes = [
  [16, 'favicon-16.png'],
  [32, 'favicon-32.png'],
  [48, 'favicon-48.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
]

for (const [size, name] of sizes) {
  await png(size, join(publicDir, name))
}

// UI logo PNG (transparent) from SVG
await png(512, join(publicDir, 'logo-it.png'))
await png(128, join(assetsBrand, 'logo-it.png'))
copyFileSync(join(publicDir, 'logo-it.svg'), join(assetsBrand, 'logo-it.svg'))

// Master raster (AI-generated reference) if present
try {
  copyFileSync(masterSrc, join(publicDir, 'logo-it-blob-master.png'))
  copyFileSync(masterSrc, join(assetsBrand, 'logo-it-blob-master.png'))
  console.log('copied master PNG')
} catch (err) {
  console.warn('master PNG not copied:', err.message)
}

const icoSizes = [16, 32, 48]
const icoParts = []
for (const size of icoSizes) {
  const buffer = await sharp(svg, { density: Math.max(72, size * 3) })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  icoParts.push({ size, buffer })
}
writeFileSync(join(publicDir, 'favicon.ico'), buildIco(icoParts))
console.log('wrote favicon.ico')
