import { test, expect } from '@playwright/test'

test.describe('Broadcasting — Übungen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/broadcasting')
    await expect(page.locator('h1')).toContainText('Broadcasting')
  })

  test('CodeBlock mit Theorie ist sichtbar', async ({ page }) => {
    const codeBlocks = page.getByTestId('code-block')
    await expect(codeBlocks.first()).toBeVisible()
  })

  // --- ShapePredictor 1 ---
  test.describe('ShapePredictor — Spalten-Broadcasting', () => {
    test('Übung wird angezeigt', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-broadcast-shape-1')
      await expect(sp).toBeVisible()
      await expect(sp.getByTestId('shape-input')).toBeVisible()
    })

    test('Korrekte Shape wird akzeptiert', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-broadcast-shape-1')
      await sp.getByTestId('shape-input').fill('3, 4')
      await sp.getByRole('button', { name: /prüfen/i }).click()
      await expect(sp.getByTestId('shape-result')).toContainText('Richtig')
    })
  })

  // --- ShapePredictor 2 ---
  test.describe('ShapePredictor — Preisberechnung', () => {
    test('Übung wird angezeigt', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-broadcast-shape-2')
      await expect(sp).toBeVisible()
    })

    test('Korrekte Shape wird akzeptiert', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-broadcast-shape-2')
      await sp.getByTestId('shape-input').fill('100, 8760')
      await sp.getByRole('button', { name: /prüfen/i }).click()
      await expect(sp.getByTestId('shape-result')).toContainText('Richtig')
    })
  })

  // --- MultipleChoice ---
  test.describe('MultipleChoice — Broadcasting-Regeln', () => {
    test('Frage wird angezeigt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-broadcast-rules')
      await expect(mc).toBeVisible()
      await expect(mc.locator('h3')).toContainText('NICHT kompatibel')
    })

    test('Richtige Antwort wird erkannt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-broadcast-rules')
      await mc.getByText('(3, 4) + (3,)', { exact: true }).click()
      await mc.getByRole('button', { name: /antwort prüfen/i }).click()
      await expect(mc.getByTestId('mc-result')).toContainText('Richtig')
    })
  })

  // --- CodingExercise ---
  test('CodingExercise ist sichtbar', async ({ page }) => {
    const coding = page.getByTestId('coding-exercise-broadcasting-coding')
    await expect(coding).toBeVisible()
    await expect(coding.locator('h3')).toContainText('Stromkosten')
  })
})
