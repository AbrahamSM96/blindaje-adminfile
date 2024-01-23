import { readdir } from 'node:fs/promises'
import { promises as fs } from 'fs'
import { join, extname } from 'path'
import { imageMeta } from 'image-meta'

const fileNames = [
  'documentos',
  'evidencias',
  'infografias',
  'multimedia',
  'presentaciones'
]

const directory = join('public', 'blindaje_material', fileNames[1])
const files = await fs.readdir(directory)

const fileCount = files.length

let metaEditions = Array.from({ length: fileCount - 1 }, () => ({
  height: null,
  width: null
}))

async function processGalleryImages() {
  try {
    const files = await readdir(directory, { withFileTypes: true })

    for (const file of files) {
      if (file.isFile() && extname(file.name) === '.webp') {
        const filePath = join(directory, file.name)
        const data = await fs.readFile(filePath)
        const { height = 0, width = 0 } = await imageMeta(data)
        // change infografias to new images
        const edition = Number(file.name.match(/evidencias-(\d+)/)?.[1] || 0)

        if (edition > 0 && edition <= metaEditions.length) {
          metaEditions[edition - 1] = { height, width }
        }
      }
    }

    const outputPath = join(
      process.cwd(),
      'src',
      'data',
      'evidencias-meta-gallery.json'
    )
    await fs.writeFile(outputPath, JSON.stringify(metaEditions))
    console.log(`Successfully wrote meta data to "${outputPath}"`)
  } catch (error) {
    console.error(`Error processing gallery images:`, error)
  }
}

processGalleryImages()
