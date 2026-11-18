import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RAW_DIR = path.resolve('raw-images')
const OUT_DIR = path.resolve('src/assets/images')

const IMAGES = [
  'work-01',
  'work-02',
  'work-03',
  'work-04',
  'work-05',
  'work-06',
  'work-07',
  'work-08',
  'work-09',
  'journal-01',
  'journal-02',
  'journal-03',
  'journal-04',
  'avatar-client',
]

const WIDTHS = [400, 800]

const PALETTE = [
  '#e85a4f',
  '#2a9d8f',
  '#264653',
  '#e9c46a',
  '#f4a261',
  '#457b9d',
  '#6d597a',
  '#3d405b',
  '#81b29a',
  '#e07a5f',
]

async function findSourceFile(baseName) {
  const extensions = ['.jpg', '.jpeg', '.png', '.webp']
  for (const ext of extensions) {
    const fullPath = path.join(RAW_DIR, `${baseName}${ext}`)
    try {
      await fs.access(fullPath)
      return fullPath
    } catch {
      // Перевіряємо наступне розширення
    }
  }
  return null
}

async function createFallbackBuffer(name, index) {
  const bg = PALETTE[index % PALETTE.length]
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="${bg}"/>
      <circle cx="400" cy="300" r="140" fill="rgba(255,255,255,0.12)"/>
      <text x="400" y="312" font-family="sans-serif" font-size="36" font-weight="bold"
            fill="#ffffff" text-anchor="middle">${name.toUpperCase()}</text>
    </svg>
  `
  return Buffer.from(svg)
}

async function run() {
  await fs.mkdir(RAW_DIR, { recursive: true })
  await fs.mkdir(OUT_DIR, { recursive: true })

  for (let i = 0; i < IMAGES.length; i++) {
    const name = IMAGES[i]
    const sourcePath = await findSourceFile(name)
    const input = sourcePath ?? (await createFallbackBuffer(name, i))

    for (const width of WIDTHS) {
      const height = Math.round(width * 0.75)
      const pipeline = sharp(input).resize(width, height, { fit: 'cover' })

      await pipeline
        .clone()
        .avif({ quality: 65 })
        .toFile(path.join(OUT_DIR, `${name}-${width}.avif`))

      await pipeline
        .clone()
        .webp({ quality: 80 })
        .toFile(path.join(OUT_DIR, `${name}-${width}.webp`))

      await pipeline
        .clone()
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(path.join(OUT_DIR, `${name}-${width}.jpg`))
    }

    console.log(`✔ ${name} -> 400w & 800w (avif, webp, jpg)`)
  }

  console.log('\nГотово! Усі 84 оптимізовані зображення збережено у src/assets/images/')
}

run()
