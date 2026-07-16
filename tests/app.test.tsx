import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '@/App'

describe('The Shape of Intelligence', () => {
  beforeEach(() => {
    window.localStorage.setItem('shape-motion', 'reduced')
    window.localStorage.setItem('shape-quality', 'lite')
  })

  it('renders the complete semantic essay when motion is reduced', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'What is the shape of intelligence?' })
    ).toBeVisible()
    expect(screen.getByText(/through silicon shaped into machines/i)).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Can we touch it?' })).toBeVisible()
    expect(
      screen.getByRole('heading', { name: 'Teaching computers how to smell.' })
    ).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Sources, not scenery.' })).toBeVisible()
    expect(document.querySelector('.matter-current canvas')).not.toBeInTheDocument()
    expect(document.querySelectorAll('.matter-atlas span')).toHaveLength(8)
  })

  it('provides chapter navigation and persistent experience controls', () => {
    render(<App />)

    expect(screen.getByRole('navigation', { name: 'Essay chapters' })).toBeVisible()
    expect(screen.getAllByRole('link', { name: /Shape/i }).length).toBeGreaterThan(0)

    const motion = screen.getByRole('button', { name: /Motion off/i })
    const detail = screen.getByRole('button', { name: /Detail lite/i })
    expect(motion).toHaveAttribute('aria-pressed', 'false')
    expect(detail).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(motion)
    fireEvent.click(detail)

    expect(screen.getByRole('button', { name: /Motion on/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: /Detail full/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('links every factual note to a visible primary or authoritative source', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: /Silicon Statistics and Information/i })).toHaveAttribute(
      'href',
      expect.stringContaining('usgs.gov')
    )
    expect(screen.getByRole('link', { name: /Detection of lung, breast/i })).toHaveAttribute(
      'href',
      expect.stringContaining('nature.com')
    )
    expect(screen.getByRole('link', { name: 'Chemotaxis in bacteria' })).toHaveAttribute(
      'href',
      expect.stringContaining('pubmed.ncbi.nlm.nih.gov')
    )
  })
})
