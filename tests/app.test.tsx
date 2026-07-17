import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { EnhancementBoundary } from '@/components/EnhancementBoundary'

function BrokenEnhancement() {
  throw new Error('chapter failed')
}

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
    expect(screen.getByText(/pattern caught by a sensor/i)).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Can we touch it?' })).toBeVisible()
    expect(
      screen.getByRole('heading', { name: 'What can a machine smell?' })
    ).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Sources, not scenery.' })).not.toBeInTheDocument()
    expect(document.querySelector('.matter-current canvas')).not.toBeInTheDocument()
    expect(document.querySelectorAll('.matter-atlas span')).toHaveLength(6)
    expect(document.querySelectorAll('[data-static-artwork]')).toHaveLength(5)
    expect(
      new Set(
        Array.from(document.querySelectorAll('[data-static-artwork]')).map((node) =>
          node.getAttribute('data-static-artwork')
        )
      ).size
    ).toBe(5)
    expect(screen.queryByText(/interactive layer paused/i)).not.toBeInTheDocument()
  })

  it('provides chapter navigation and persistent experience controls', () => {
    render(<App />)

    expect(screen.getByRole('navigation', { name: 'Essay chapters' })).toBeVisible()
    expect(screen.getByRole('navigation', { name: 'Chapter controls' })).toBeVisible()
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

  it('keeps the semantic fallback when an enhancement fails', () => {
    const report = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    render(
      <EnhancementBoundary label="Test study" fallback={<p>Static study remains available.</p>}>
        <BrokenEnhancement />
      </EnhancementBoundary>
    )

    expect(screen.getByText('Static study remains available.')).toBeVisible()
    report.mockRestore()
  })
})
