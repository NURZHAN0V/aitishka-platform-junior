import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const sourceDir = path.join(rootDir, 'src/assets/images/illustrations/_source')
const illustrationsDir = path.join(rootDir, 'src/assets/images/illustrations')

const CORNER_SAMPLE_SIZE = 5
const BG_TOLERANCE = 32
const EDGE_CLEARANCE = 3
const FEATHER_PASSES = 1

const CATEGORY_MAP = {
  brand: 'brand',
  subjects: 'subjects',
  widgets: 'widgets',
  market: 'market',
  nav: 'nav',
  journal: 'journal',
  games: 'games',
}

function getPixel(data, x, y, width, channels) {
  const index = (y * width + x) * channels
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
    a: data[index + 3],
    index,
  }
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid]
}

function medianCornerColor(data, width, height, channels) {
  const size = CORNER_SAMPLE_SIZE
  const corners = [
    [0, 0],
    [Math.max(0, width - size), 0],
    [0, Math.max(0, height - size)],
    [Math.max(0, width - size), Math.max(0, height - size)],
  ]

  const reds = []
  const greens = []
  const blues = []

  for (const [startX, startY] of corners) {
    for (let y = startY; y < startY + size && y < height; y += 1) {
      for (let x = startX; x < startX + size && x < width; x += 1) {
        const pixel = getPixel(data, x, y, width, channels)
        reds.push(pixel.r)
        greens.push(pixel.g)
        blues.push(pixel.b)
      }
    }
  }

  return {
    r: median(reds),
    g: median(greens),
    b: median(blues),
  }
}

function matchesBackground(pixel, bg, tolerance) {
  if (pixel.a === 0) return true
  if (pixel.r > 215 && pixel.g > 215 && pixel.b > 215) {
    return colorDistance(pixel.r, pixel.g, pixel.b, bg.r, bg.g, bg.b) <= tolerance + 12
  }
  return colorDistance(pixel.r, pixel.g, pixel.b, bg.r, bg.g, bg.b) <= tolerance
}

function isNearEdge(x, y, width, height, clearance) {
  return x < clearance || y < clearance || x >= width - clearance || y >= height - clearance
}

function clearEdgeBackground(data, width, height, channels, bg) {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!isNearEdge(x, y, width, height, EDGE_CLEARANCE)) continue

      const pixel = getPixel(data, x, y, width, channels)
      if (pixel.a === 0) continue

      const isLightBorder = pixel.r > 215 && pixel.g > 215 && pixel.b > 215
      if (matchesBackground(pixel, bg, BG_TOLERANCE) || isLightBorder) {
        data[pixel.index + 3] = 0
      }
    }
  }
}

function removeEdgeBackground(data, width, height, channels) {
  const bg = medianCornerColor(data, width, height, channels)
  const total = width * height
  const transparent = new Uint8Array(total)
  const queue = []

  function tryEnqueue(x, y) {
    const pos = y * width + x
    if (transparent[pos]) return

    const pixel = getPixel(data, x, y, width, channels)
    if (!matchesBackground(pixel, bg, BG_TOLERANCE)) return

    transparent[pos] = 1
    queue.push(pos)
  }

  for (let x = 0; x < width; x += 1) {
    tryEnqueue(x, 0)
    tryEnqueue(x, height - 1)
  }

  for (let y = 0; y < height; y += 1) {
    tryEnqueue(0, y)
    tryEnqueue(width - 1, y)
  }

  while (queue.length > 0) {
    const pos = queue.pop()
    const x = pos % width
    const y = Math.floor(pos / width)

    if (x > 0) tryEnqueue(x - 1, y)
    if (x < width - 1) tryEnqueue(x + 1, y)
    if (y > 0) tryEnqueue(x, y - 1)
    if (y < height - 1) tryEnqueue(x, y + 1)
  }

  for (let pos = 0; pos < total; pos += 1) {
    if (transparent[pos]) {
      data[pos * channels + 3] = 0
    }
  }

  clearEdgeBackground(data, width, height, channels, bg)
  featherEdges(data, width, height, channels, bg, transparent)
}

function featherEdges(data, width, height, channels, bg, transparent) {
  for (let pass = 0; pass < FEATHER_PASSES; pass += 1) {
    const alphas = new Uint8Array(width * height)

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const pos = y * width + x
        const pixel = getPixel(data, x, y, width, channels)

        if (pixel.a === 0 || matchesBackground(pixel, bg, BG_TOLERANCE)) {
          alphas[pos] = 0
          continue
        }

        if (transparent[pos]) continue

        let neighborTransparent = 0
        const neighbors = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ]

        for (const [nx, ny] of neighbors) {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          const nPos = ny * width + nx
          if (data[nPos * channels + 3] === 0) {
            neighborTransparent += 1
          }
        }

        if (neighborTransparent > 0) {
          alphas[pos] = Math.max(0, pixel.a - neighborTransparent * 40)
        } else {
          alphas[pos] = pixel.a
        }
      }
    }

    for (let pos = 0; pos < width * height; pos += 1) {
      data[pos * channels + 3] = alphas[pos]
    }
  }
}

async function collectPngFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectPngFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith('.png')) {
      files.push(fullPath)
    }
  }

  return files
}

function resolveOutputPath(sourcePath) {
  const relativePath = path.relative(sourceDir, sourcePath)
  const parts = relativePath.split(path.sep)

  if (parts.length > 1 && CATEGORY_MAP[parts[0]]) {
    const category = parts[0]
    const fileName = path.basename(sourcePath, '.png')
    return path.join(illustrationsDir, category, `${fileName}.avif`)
  }

  const fileName = path.basename(sourcePath, '.png')

  if (fileName.startsWith('market-')) {
    return path.join(illustrationsDir, 'market', `${fileName}.avif`)
  }

  if (fileName.endsWith('-subject')) {
    return path.join(illustrationsDir, 'subjects', `${fileName}.avif`)
  }

  const brandNames = ['logo-cube', 'robot-mascot', 'coin-single', 'coin-stack']
  if (brandNames.includes(fileName)) {
    return path.join(illustrationsDir, 'brand', `${fileName}.avif`)
  }

  const widgetNames = [
    'trophy',
    'backpack',
    'homework-notepad',
    'treasure-chest',
    'shopping-basket',
    'rocket',
    'student-boy',
    'avatar-more-variants',
    'photo-polaroid-card',
  ]
  if (widgetNames.includes(fileName)) {
    return path.join(illustrationsDir, 'widgets', `${fileName}.avif`)
  }

  if (fileName.startsWith('nav-')) {
    return path.join(illustrationsDir, 'nav', `${fileName}.avif`)
  }

  return path.join(illustrationsDir, 'brand', `${fileName}.avif`)
}

async function convertFile(sourcePath) {
  const outputPath = resolveOutputPath(sourcePath)
  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const buffer = Buffer.from(data)
  removeEdgeBackground(buffer, info.width, info.height, info.channels)

  await sharp(buffer, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .avif({
      quality: 85,
      effort: 4,
      lossless: false,
    })
    .toFile(outputPath)

  return outputPath
}

async function main() {
  try {
    await stat(sourceDir)
  } catch {
    console.error(`Source directory not found: ${sourceDir}`)
    process.exit(1)
  }

  const pngFiles = await collectPngFiles(sourceDir)

  if (pngFiles.length === 0) {
    console.log('No PNG files found in _source/')
    return
  }

  for (const sourcePath of pngFiles) {
    const outputPath = await convertFile(sourcePath)
    console.log(`Converted: ${path.relative(rootDir, sourcePath)} → ${path.relative(rootDir, outputPath)}`)
  }

  console.log(`Done. Converted ${pngFiles.length} file(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
