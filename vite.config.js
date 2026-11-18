import vituum from 'vituum'
import pug from '@vituum/vite-plugin-pug'
import path from 'path'
import fs from 'node:fs'

const BASE_PATH = '/landing-keepsake-vite/'

function srcsetAssetsPlugin() {
  return {
    name: 'vite-plugin-srcset-assets',
    enforce: 'post',
    generateBundle(_, bundle) {
      const emitted = new Map()

      for (const [key, file] of Object.entries(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.html')) {
          const updatedHtml = String(file.source).replace(/srcset="([^"]+)"/g, (_, srcsetValue) => {
            const updated = srcsetValue.replace(
              /\/src\/assets\/images\/([^\s,"]+)/g,
              (match, imgName) => {
                if (!emitted.has(imgName)) {
                  const diskPath = path.resolve(import.meta.dirname, 'src/assets/images', imgName)
                  if (fs.existsSync(diskPath)) {
                    const refId = this.emitFile({
                      type: 'asset',
                      name: imgName,
                      source: fs.readFileSync(diskPath),
                    })
                    emitted.set(imgName, BASE_PATH + this.getFileName(refId))
                  } else {
                    return match
                  }
                }
                return emitted.get(imgName)
              }
            )
            return `srcset="${updated}"`
          })

          if (key === 'index.pug.html') {
            this.emitFile({
              type: 'asset',
              fileName: 'index.html',
              source: updatedHtml,
            })
          } else {
            file.source = updatedHtml
          }
        }
      }
    },
  }
}

export default {
  base: BASE_PATH,
  build: {
    assetsInlineLimit: 0,
  },
  plugins: [
    vituum({
      imports: {
        filenamePattern: {
          '+.css': [],
          '+.scss': [],
        },
      },
    }),
    pug({ root: './src' }),
    srcsetAssetsPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
    },
  },
}
