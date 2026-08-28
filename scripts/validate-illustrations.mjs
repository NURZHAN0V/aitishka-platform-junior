import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const illustrationsDir = path.join(rootDir, 'src/assets/images/illustrations')

const MIN_TRANSPARENT_PERCENT = 15
const CORNER_ALPHA_MAX = 16

async function collectAvifFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === '_source') continue
      files.push(...(await collectAvifFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith('.avif')) {
      files.push(fullPath)
    }
  }

  return files
}

function getAlpha(data, x, y, width, channels) {
  return data[(y * width + x) * channels + 3]
}

async function analyzeAvif(filePath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const total = width * height
  let transparentCount = 0

  for (let pos = 0; pos < total; pos += 1) {
    if (data[pos * channels + 3] < CORNER_ALPHA_MAX) {
      transparentCount += 1
    }
  }

  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ]

  const cornerAlphas = corners.map(([x, y]) => getAlpha(data, x, y, width, channels))
  const transparentPercent = (transparentCount / total) * 100
  const cornersTransparent = cornerAlphas.every((alpha) => alpha < CORNER_ALPHA_MAX)

  return {
    file: path.relative(rootDir, filePath),
    transparentPercent,
    cornersTransparent,
    cornerAlphas,
    ok: cornersTransparent && transparentPercent >= MIN_TRANSPARENT_PERCENT,
  }
}

async function main() {
  try {
    await stat(illustrationsDir)
  } catch {
    console.error(`Illustrations directory not found: ${illustrationsDir}`)
    process.exit(1)
  }

  const files = await collectAvifFiles(illustrationsDir)

  if (files.length === 0) {
    console.error('No AVIF files found.')
    process.exit(1)
  }

  const results = []
  for (const file of files) {
    results.push(await analyzeAvif(file))
  }

  const failed = results.filter((result) => !result.ok)
  const passed = results.filter((result) => result.ok)

  console.log(`Validated ${results.length} illustration(s).`)
  console.log(`Passed: ${passed.length}`)
  console.log(`Failed: ${failed.length}`)

  if (failed.length > 0) {
    console.log('\nFailed files:')
    for (const result of failed) {
      console.log(
        `- ${result.file}: transparent=${result.transparentPercent.toFixed(1)}%, cornerAlphas=[${result.cornerAlphas.join(', ')}]`,
      )
    }
    process.exit(1)
  }

  console.log('All illustrations have transparent backgrounds.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
