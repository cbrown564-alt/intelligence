import { readFile, stat } from 'node:fs/promises'
import { gzip } from 'node:zlib'
import { promisify } from 'node:util'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const gzipAsync = promisify(gzip)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assets = path.resolve(root, process.argv[2] ?? 'dist')
const html = await readFile(path.join(assets, 'index.html'), 'utf8')
const entryMatch = html.match(/<script[^>]+src="\.\/([^"]+\.js)"/)

if (!entryMatch) {
  throw new Error(`Could not find the production entry script in ${assets}/index.html`)
}

const entryPath = path.join(assets, entryMatch[1])
const source = await readFile(entryPath)
const compressed = await gzipAsync(source)
const budget = 150 * 1024

if (compressed.byteLength > budget) {
  throw new Error(
    `Initial JavaScript is ${(compressed.byteLength / 1024).toFixed(1)} KB gzip; budget is 150 KB.`
  )
}

const file = await stat(entryPath)
console.log(
  `Initial JavaScript: ${(file.size / 1024).toFixed(1)} KB / ${(compressed.byteLength / 1024).toFixed(1)} KB gzip (budget: 150 KB gzip)`
)
