import fs from 'node:fs'
import path from 'node:path'

const output = '.cloudflare/output/v0'
const { buildContext: { mode } } = JSON.parse(fs.readFileSync(path.join(output, 'config.json'), 'utf8'))
if (!['production', 'migration-preview'].includes(mode)) {
  throw new Error(`Refusing to prepare an unexpected deployment mode: ${mode}`)
}
const assets = path.join(output, 'workers/default/assets')
const headers = fs.readFileSync('public/_headers', 'utf8')
const prepared = mode === 'production' ? headers.replace(/^  X-Robots-Tag:.*\n/gm, '') : headers
if (prepared.trim() === '/*') fs.unlinkSync(path.join(assets, '_headers'))
else fs.writeFileSync(path.join(assets, '_headers'), prepared)
console.log(`Prepared ${mode} indexing policy; preview remains noindex.`)
