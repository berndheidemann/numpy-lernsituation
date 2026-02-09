import { test, expect } from '@playwright/test'

// ── ArrayVisualizer (on IndexingSlicing page) ──

test.describe('ArrayVisualizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/indexing-slicing')
  })

  test('renders SVG grid with correct role and label', async ({ page }) => {
    const viz = page.getByTestId('array-visualizer').first()
    await expect(viz).toBeVisible()
    const svg = viz.locator('svg')
    await expect(svg).toHaveAttribute('role', 'img')
    await expect(svg).toHaveAttribute('aria-label', /4 Zeilen.*5 Spalten/)
  })

  test('shows all cell values from data', async ({ page }) => {
    const viz = page.getByTestId('array-visualizer').first()
    // Check a few known values from the sampleData
    await expect(viz.locator('text').filter({ hasText: '10' }).first()).toBeVisible()
    await expect(viz.locator('text').filter({ hasText: '55' }).first()).toBeVisible()
    await expect(viz.locator('text').filter({ hasText: '65' }).first()).toBeVisible()
  })
})

// ── IndexingHighlighter (on IndexingSlicing page) ──

test.describe('IndexingHighlighter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/indexing-slicing')
  })

  test('renders with slicing input field', async ({ page }) => {
    const highlighter = page.getByTestId('indexing-highlighter')
    await expect(highlighter).toBeVisible()
    const input = page.getByTestId('slicing-input')
    await expect(input).toBeVisible()
  })

  test('entering a slicing expression updates selected count', async ({ page }) => {
    const input = page.getByTestId('slicing-input')
    await input.fill('1:3, 2:4')
    // 2 rows × 2 cols = 4 elements
    await expect(page.getByTestId('indexing-highlighter')).toContainText('4 Elemente ausgewählt')
  })

  test('shows result values after slicing', async ({ page }) => {
    const input = page.getByTestId('slicing-input')
    await input.fill('0, 0')
    // arr[0, 0] = 10
    await expect(page.getByTestId('indexing-highlighter')).toContainText('1 Elemente ausgewählt')
    await expect(page.getByTestId('indexing-highlighter').locator('.bg-green-50')).toContainText('10')
  })

  test('colon selects all elements', async ({ page }) => {
    const input = page.getByTestId('slicing-input')
    await input.fill(':')
    // All rows, all cols = 4 × 5 = 20 elements
    await expect(page.getByTestId('indexing-highlighter')).toContainText('20 Elemente ausgewählt')
  })
})

// ── PerformanceChart (on WarumNumpy page) ──

test.describe('PerformanceChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/warum-numpy')
  })

  test('renders with slider and speedup badge', async ({ page }) => {
    const chart = page.getByTestId('performance-chart')
    await expect(chart).toBeVisible()
    await expect(page.getByTestId('size-slider')).toBeVisible()
    await expect(page.getByTestId('speedup-badge')).toBeVisible()
  })

  test('shows speedup value', async ({ page }) => {
    const badge = page.getByTestId('speedup-badge')
    // Badge should contain "x schneller"
    await expect(badge).toContainText(/\d+x schneller/)
  })

  test('slider changes displayed array size', async ({ page }) => {
    const slider = page.getByTestId('size-slider')
    // Move slider to leftmost position (smallest size)
    await slider.fill('0')
    const chart = page.getByTestId('performance-chart')
    // Smallest benchmark size is 1.000
    await expect(chart).toContainText('1.000')
  })
})

// ── BroadcastingAnimator (on Broadcasting page) ──

test.describe('BroadcastingAnimator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/broadcasting')
  })

  test('renders multiple broadcasting examples', async ({ page }) => {
    const animators = page.getByTestId('broadcasting-animator')
    await expect(animators).toHaveCount(3)
  })

  test('shows step counter and navigation buttons', async ({ page }) => {
    const first = page.getByTestId('broadcasting-animator').first()
    await expect(first.getByTestId('step-back')).toBeVisible()
    await expect(first.getByTestId('step-forward')).toBeVisible()
    await expect(first).toContainText(/1 \/ \d+/)
  })

  test('stepping forward changes the step description', async ({ page }) => {
    const first = page.getByTestId('broadcasting-animator').first()
    const initialText = await first.locator('.bg-blue-50, .bg-green-50, .bg-red-50').first().textContent()
    await first.getByTestId('step-forward').click()
    // After stepping, step counter should advance to 2
    await expect(first).toContainText(/2 \/ \d+/)
  })

  test('back button is disabled on first step', async ({ page }) => {
    const first = page.getByTestId('broadcasting-animator').first()
    await expect(first.getByTestId('step-back')).toBeDisabled()
  })

  test('incompatible example shows error step', async ({ page }) => {
    // Third example is (3,4) + (3,) which is incompatible
    const third = page.getByTestId('broadcasting-animator').nth(2)
    // Step forward through all steps to reach the error
    const fwd = third.getByTestId('step-forward')
    while (await fwd.isEnabled()) {
      await fwd.click()
    }
    // Should show an error/incompatible message
    await expect(third).toContainText(/Inkompatibel/)
  })
})

// ── ShapeTransformer (on ReshapeManipulation page) ──

test.describe('ShapeTransformer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/reshape-manipulation')
  })

  test('renders with shape option buttons', async ({ page }) => {
    const transformer = page.getByTestId('shape-transformer')
    await expect(transformer).toBeVisible()
    // Check that at least the (3, 4) and (4, 3) options exist
    await expect(page.getByTestId('shape-option-3x4')).toBeVisible()
    await expect(page.getByTestId('shape-option-4x3')).toBeVisible()
  })

  test('clicking a shape option changes the displayed shape', async ({ page }) => {
    const transformer = page.getByTestId('shape-transformer')
    // Click on (6, 2)
    await page.getByTestId('shape-option-6x2').click()
    await expect(transformer).toContainText('Shape (6, 2)')
  })

  test('shows flat memory strip', async ({ page }) => {
    const transformer = page.getByTestId('shape-transformer')
    await expect(transformer).toContainText('Speicher (flach)')
  })
})

// ── MemoryLayoutViewer (on ReshapeManipulation page) ──

test.describe('MemoryLayoutViewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/reshape-manipulation')
  })

  test('renders with C and F order buttons', async ({ page }) => {
    const viewer = page.getByTestId('memory-layout-viewer')
    await expect(viewer).toBeVisible()
    await expect(page.getByTestId('order-c')).toBeVisible()
    await expect(page.getByTestId('order-f')).toBeVisible()
  })

  test('C-Order button is initially active', async ({ page }) => {
    const cButton = page.getByTestId('order-c')
    // Active button has bg-blue-600 class
    await expect(cButton).toHaveClass(/bg-blue-600/)
  })

  test('switching to F-Order updates the label', async ({ page }) => {
    await page.getByTestId('order-f').click()
    const viewer = page.getByTestId('memory-layout-viewer')
    await expect(viewer).toContainText('Column-Major: Spalte für Spalte')
  })

  test('shows logical array and memory strip', async ({ page }) => {
    const viewer = page.getByTestId('memory-layout-viewer')
    await expect(viewer).toContainText('Logisches Array')
    await expect(viewer).toContainText('Speicher')
  })
})
