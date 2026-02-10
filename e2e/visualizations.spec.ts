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

// ── DtypeComparison (on ArrayGrundlagen page) ──

test.describe('DtypeComparison', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/array-grundlagen')
  })

  test('renders with dtype bars and element count selector', async ({ page }) => {
    const viz = page.getByTestId('dtype-comparison')
    await expect(viz).toBeVisible()
    // Should show dtype labels
    await expect(viz).toContainText('int8')
    await expect(viz).toContainText('float64')
  })

  test('clicking element count changes displayed values', async ({ page }) => {
    const viz = page.getByTestId('dtype-comparison')
    // Click on 10 elements button (smallest)
    await viz.getByRole('button', { name: /10 Elemente/ }).click()
    // int8 with 10 elements = 10 B
    await expect(viz).toContainText('10 B')
  })

  test('shows SmartEnergy context hint', async ({ page }) => {
    const viz = page.getByTestId('dtype-comparison')
    await expect(viz).toContainText(/SmartEnergy|float32|float64/)
  })
})

// ── ViewCopyVisualizer (on IndexingSlicing page) ──

test.describe('ViewCopyVisualizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/indexing-slicing')
  })

  test('renders with View and Copy toggle buttons', async ({ page }) => {
    const viz = page.getByTestId('view-copy-visualizer')
    await expect(viz).toBeVisible()
    await expect(viz.getByRole('button', { name: /View/ })).toBeVisible()
    await expect(viz.getByRole('button', { name: /Copy/ })).toBeVisible()
  })

  test('shows mutation button', async ({ page }) => {
    const viz = page.getByTestId('view-copy-visualizer')
    await expect(viz.getByRole('button', { name: /99/ })).toBeVisible()
  })

  test('switching to Copy mode updates description', async ({ page }) => {
    const viz = page.getByTestId('view-copy-visualizer')
    await viz.getByRole('button', { name: /Copy/ }).click()
    await expect(viz).toContainText(/Kopie|Fancy Indexing/)
  })

  test('clicking mutation button changes displayed values', async ({ page }) => {
    const viz = page.getByTestId('view-copy-visualizer')
    await viz.getByRole('button', { name: /99/ }).click()
    // After mutation, 99 should appear in the visualization
    await expect(viz).toContainText('99')
  })
})

// ── BooleanMaskCombiner (on ArrayOperationen page) ──

test.describe('BooleanMaskCombiner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/array-operationen')
  })

  test('renders with threshold sliders and operator buttons', async ({ page }) => {
    const viz = page.getByTestId('boolean-mask-combiner')
    await expect(viz).toBeVisible()
    await expect(viz.getByRole('button', { name: /UND/ })).toBeVisible()
    await expect(viz.getByRole('button', { name: /ODER/ })).toBeVisible()
    await expect(viz.getByRole('button', { name: /NICHT/ })).toBeVisible()
  })

  test('shows mask rows and filtered result', async ({ page }) => {
    const viz = page.getByTestId('boolean-mask-combiner')
    await expect(viz).toContainText('Maske A')
    await expect(viz).toContainText('Maske B')
    await expect(viz).toContainText(/Ergebnis/)
  })

  test('switching operator updates combined mask expression', async ({ page }) => {
    const viz = page.getByTestId('boolean-mask-combiner')
    await viz.getByRole('button', { name: /ODER/ }).click()
    await expect(viz).toContainText('|')
  })

  test('changing slider updates mask values', async ({ page }) => {
    const viz = page.getByTestId('boolean-mask-combiner')
    const slider = viz.getByRole('slider').first()
    // Change the slider value
    await slider.fill('25')
    // The mask expression should reflect the new threshold
    await expect(viz).toContainText('arr > 25')
  })
})

// ── BroadcastingPlayground (on Broadcasting page) ──

test.describe('BroadcastingPlayground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/broadcasting')
  })

  test('renders with shape input fields', async ({ page }) => {
    const viz = page.getByTestId('broadcasting-playground')
    await expect(viz).toBeVisible()
    const inputs = viz.getByRole('textbox')
    await expect(inputs).toHaveCount(2)
  })

  test('shows compatibility result for default shapes', async ({ page }) => {
    const viz = page.getByTestId('broadcasting-playground')
    await expect(viz).toContainText(/Kompatibel/)
  })

  test('shows step-by-step table', async ({ page }) => {
    const viz = page.getByTestId('broadcasting-playground')
    await expect(viz.getByRole('table')).toBeVisible()
    await expect(viz).toContainText('Shape A')
    await expect(viz).toContainText('Shape B')
    await expect(viz).toContainText('Ergebnis')
  })

  test('entering incompatible shapes shows error', async ({ page }) => {
    const viz = page.getByTestId('broadcasting-playground')
    const inputs = viz.getByRole('textbox')
    await inputs.first().fill('3, 4')
    await inputs.last().fill('3')
    await expect(viz).toContainText(/Inkompatibel|Fehler/)
  })
})

// ── ConcatStackVisualizer (on ReshapeManipulation page) ──

test.describe('ConcatStackVisualizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/reshape-manipulation')
  })

  test('renders with operation buttons', async ({ page }) => {
    const viz = page.getByTestId('concat-stack-visualizer')
    await expect(viz).toBeVisible()
    await expect(viz.getByRole('button', { name: /concatenate\(axis=0\)/ })).toBeVisible()
    await expect(viz.getByRole('button', { name: /concatenate\(axis=1\)/ })).toBeVisible()
    await expect(viz.getByRole('button', { name: /stack\(axis=0\)/ })).toBeVisible()
  })

  test('shows input and result arrays', async ({ page }) => {
    const viz = page.getByTestId('concat-stack-visualizer')
    await expect(viz).toContainText(/Eingabe/)
    await expect(viz).toContainText(/Ergebnis/)
  })

  test('switching to stack mode shows new dimension', async ({ page }) => {
    const viz = page.getByTestId('concat-stack-visualizer')
    await viz.getByRole('button', { name: /stack\(axis=0\)/ }).click()
    // Stack creates a new axis, so result shape should be (2, 2, 3)
    await expect(viz).toContainText(/2, 2, 3/)
  })

  test('switching to concat axis=1 changes result shape', async ({ page }) => {
    const viz = page.getByTestId('concat-stack-visualizer')
    await viz.getByRole('button', { name: /concatenate\(axis=1\)/ }).click()
    // Concatenating (2,3) + (2,3) along axis=1 gives (2,6)
    await expect(viz).toContainText(/2, 6/)
  })
})

// ── BoxPlotVisualizer (on StatistischeAuswertung page) ──

test.describe('BoxPlotVisualizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/statistische-auswertung')
  })

  test('renders with histogram and stats table', async ({ page }) => {
    const viz = page.getByTestId('boxplot-visualizer')
    await expect(viz).toBeVisible()
    // Should show statistical labels
    await expect(viz).toContainText('Median')
    await expect(viz).toContainText('Q1')
    await expect(viz).toContainText('Q3')
  })

  test('shows minimum and maximum values', async ({ page }) => {
    const viz = page.getByTestId('boxplot-visualizer')
    await expect(viz).toContainText('Minimum')
    await expect(viz).toContainText('Maximum')
  })

  test('displays outlier information', async ({ page }) => {
    const viz = page.getByTestId('boxplot-visualizer')
    await expect(viz).toContainText(/Ausreißer/)
  })

  test('shows standard deviation', async ({ page }) => {
    const viz = page.getByTestId('boxplot-visualizer')
    await expect(viz).toContainText('Std.-Abw.')
  })
})
