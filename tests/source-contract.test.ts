// @vitest-environment node
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()

describe('release contracts', () => {
  it('keeps motion optional and content visible by default', async () => {
    const [css, hero] = await Promise.all([
      readFile(path.join(root, 'src', 'index.css'), 'utf8'),
      readFile(path.join(root, 'src', 'sections', 'Hero.tsx'), 'utf8'),
    ])

    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain("html[data-motion='reduced']")
    expect(hero).not.toContain('opacity-0')
    expect(hero).not.toContain('gsap')
  })

  it('marks every source-authored canvas as hidden from the accessibility tree', async () => {
    const directories = [path.join(root, 'src', 'sections'), path.join(root, 'src', 'components')]
    const sources = await Promise.all(directories.map(async (directory) => {
      const files = (await readdir(directory)).filter((file) => file.endsWith('.tsx'))
      return Promise.all(files.map((file) => readFile(path.join(directory, file), 'utf8')))
    }))
    const source = sources.flat(2).join('\n')
    const tags = source.match(/<canvas[\s\S]*?\/>/g) ?? []

    expect(tags.length).toBeGreaterThanOrEqual(7)
    for (const tag of tags) expect(tag).toContain('aria-hidden="true"')
  })

  it('does not restore the removed scaffold or reflex font stack', async () => {
    const [uiFiles, html, packageJson] = await Promise.all([
      readdir(path.join(root, 'src', 'components', 'ui')).catch(() => []),
      readFile(path.join(root, 'index.html'), 'utf8'),
      readFile(path.join(root, 'package.json'), 'utf8'),
    ])

    expect(uiFiles).toHaveLength(0)
    expect(html).not.toMatch(/Fraunces|Space Grotesk|IBM Plex/)
    expect(packageJson).not.toMatch(/gsap|react-router|@radix-ui|recharts/)
  })

  it('keeps metaphorical claims bounded by the essay’s stated position', async () => {
    const directories = [path.join(root, 'src', 'sections'), path.join(root, 'src', 'content')]
    const sources = await Promise.all(directories.map(async (directory) => {
      const files = (await readdir(directory)).filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
      return Promise.all(files.map((file) => readFile(path.join(directory, file), 'utf8')))
    }))
    const source = sources.flat(2).join('\n')

    expect(source).not.toMatch(/minds we made|sand (?:can learn|how) to think|whole trick of intelligence/i)
    expect(source).not.toMatch(/whatever we dare|not another chatbox|latent space/i)
    expect(source).toContain('Towers rise from dust')
  })

  it('pins the governing claim across the webpage, film, captions, and transcript', async () => {
    const [hero, chapters, film, captions, transcript] = await Promise.all([
      readFile(path.join(root, 'src', 'sections', 'Hero.tsx'), 'utf8'),
      readFile(path.join(root, 'src', 'content', 'chapters.ts'), 'utf8'),
      readFile(path.join(root, 'video', 'ShapeOfIntelligenceVideo.tsx'), 'utf8'),
      readFile(path.join(root, 'video', 'shape-of-intelligence.en.srt'), 'utf8'),
      readFile(path.join(root, 'video', 'transcript.md'), 'utf8'),
    ])

    expect(hero).toContain('What does each form reveal—and what does it hide?')
    expect(chapters).toContain(
      'Every form reveals something and obscures something else.'
    )
    for (const source of [film, captions, transcript]) {
      expect(source).toContain('New senses bring')
      expect(source).toContain('different machine into view.')
      expect(source).not.toMatch(/a mind can inhabit|ascending mind/i)
    }
  })

  it('keeps Forms to three primary instruments with audience-facing indices', async () => {
    const forms = await readFile(
      path.join(root, 'src', 'sections', 'FormsChapter.tsx'),
      'utf8'
    )

    expect(forms.match(/<Instrument\b/g)).toHaveLength(3)
    expect(forms).not.toMatch(/[αβγδε]/)
    expect(forms).toContain('Rhythm. Pattern.')
    expect(forms).toContain('Flock.')
  })
})
