import sharp from 'sharp'
import { join, dirname, extname, basename } from 'node:path'
import { readdir, unlink, rm, rename } from 'node:fs/promises'

const sourcePath = 'public/blindaje_material/evidencias'
const fileExtensions = ['jpg', 'jpeg', 'png', 'webp']

const replaceExtWithDot = (newExtWithDot: string, inFilePath: string) =>
  join(dirname(inFilePath), basename(inFilePath, extname(inFilePath))) +
  newExtWithDot

const shouldRemove = (str = '') => str.toLowerCase().startsWith('rm')
const remove = shouldRemove(process.argv[2]?.toLowerCase())

const getFiles = async (dir: string) => {
  const dirents = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = join(dir, dirent.name)
      return dirent.isDirectory() ? getFiles(res) : res
    })
  )
  return Array.prototype.concat(...files)
}

const convertAndRemoveFiles = async () => {
  const files = await getFiles(sourcePath)

  for (const file of files) {
    if (!fileExtensions.includes(extname(file).slice(1).toLowerCase())) {
      continue // Skip files with extensions other than jpg, jpeg, or png
    }

    console.info(`Converting ${file}`)

    const newFilePath = replaceExtWithDot('.webp', file)

    const convert = sharp(file).webp({
      lossless: true,
      quality: 1
    })

    await convert.toFile(newFilePath)
    console.info(`Converted to ${newFilePath}`)

    // Delete the original file after renaming
    await unlink(file)
    console.info(`Deleted original file ${file}`)
  }
}

convertAndRemoveFiles()
