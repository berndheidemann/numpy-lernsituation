import { test, expect } from '@playwright/test'

test.describe('IndexingSlicing — Übungen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/indexing-slicing')
    await expect(page.locator('h1')).toContainText('Indexing & Slicing')
  })

  test('CodeBlock mit Theorie ist sichtbar', async ({ page }) => {
    const codeBlocks = page.getByTestId('code-block')
    await expect(codeBlocks.first()).toBeVisible()
  })

  // --- ArrayFillExercise ---
  test.describe('ArrayFillExercise — Slicing-Ergebnis', () => {
    test('Übung wird angezeigt', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-slicing-result-1')
      await expect(af).toBeVisible()
      await expect(af.locator('h3')).toContainText('Slicing-Ergebnis')
    })

    test('Korrekte Werte werden akzeptiert', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-slicing-result-1')
      await af.getByTestId('cell-0-0').fill('33')
      await af.getByTestId('cell-0-1').fill('44')
      await af.getByTestId('cell-1-0').fill('36')
      await af.getByTestId('cell-1-1').fill('48')
      await af.getByRole('button', { name: /überprüfen/i }).click()
      await expect(af.getByTestId('arrayfill-result')).toContainText('korrekt')
    })

    test('Falsche Werte werden markiert', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-slicing-result-1')
      await af.getByTestId('cell-0-0').fill('10')
      await af.getByTestId('cell-0-1').fill('44')
      await af.getByTestId('cell-1-0').fill('36')
      await af.getByTestId('cell-1-1').fill('48')
      await af.getByRole('button', { name: /überprüfen/i }).click()
      await expect(af.getByTestId('arrayfill-result')).toContainText('falsch')
    })
  })

  // --- MultipleChoice ---
  test.describe('MultipleChoice — View or Copy', () => {
    test('Frage wird angezeigt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-view-or-copy')
      await expect(mc).toBeVisible()
      await expect(mc.locator('h3')).toContainText('Kopie')
    })

    test('Richtige Antwort wird als korrekt markiert', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-view-or-copy')
      await mc.getByText('verbrauch[[0, 2]]').click()
      await mc.getByRole('button', { name: /antwort prüfen/i }).click()
      await expect(mc.getByTestId('mc-result')).toContainText('Richtig')
    })
  })

  // --- CodingExercise ---
  test('CodingExercise ist sichtbar', async ({ page }) => {
    const coding = page.getByTestId('coding-exercise-indexing-coding')
    await expect(coding).toBeVisible()
    await expect(coding.locator('h3')).toContainText('Haushalt-Daten extrahieren')
  })
})
