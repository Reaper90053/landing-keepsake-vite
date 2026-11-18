import vituum from 'vituum'
import pug from '@vituum/vite-plugin-pug'
import path from 'path'
import fs from 'node:fs'

function srcsetAssetsPlugin() {
  return {
    name: 'vite-plugin-srcset-assets',
    enforce: 'post',
    generateBundle(_, bundle) {
      const emitted = new Map()

      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.html')) {
          file.source = String(file.source).replace(
            /srcset="([^"]+)"/g,
            (_, srcsetValue) => {
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
                      emitted.set(imgName, '/' + this.getFileName(refId))
                    } else {
                      return match
                    }
                  }
                  return emitted.get(imgName)
                }
              )
              return `srcset="${updated}"`
            }
          )
        }
      }
    },
  }
}

export default {
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