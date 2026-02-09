import { test, expect } from '@playwright/test'

test.describe('StatistischeAuswertung — Übungen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/statistische-auswertung')
    await expect(page.locator('h1')).toContainText('Statistische Auswertung')
  })

  test('Theorie-CodeBlocks sind sichtbar', async ({ page }) => {
    const codeBlocks = page.getByTestId('code-block')
    await expect(codeBlocks.first()).toBeVisible()
  })

  test('ArrayVisualizer mit Verbrauchsdaten ist sichtbar', async ({ page }) => {
    await expect(page.getByTestId('array-visualizer').first()).toBeVisible()
  })

  // --- DragDropExercise ---
  test.describe('DragDropExercise — Statistik-Zuordner', () => {
    test('Drag-Items und Drop-Zones werden angezeigt', async ({ page }) => {
      const dd = page.getByTestId('dragdrop-exercise-statistik-zuordner')
      await expect(dd).toBeVisible()
      await expect(dd.getByTestId('drag-item-fn-mean')).toBeVisible()
      await expect(dd.getByTestId('drop-zone-zone-durchschnitt')).toBeVisible()
    })

    test('Überprüfen-Button ist initial deaktiviert', async ({ page }) => {
      const dd = page.getByTestId('dragdrop-exercise-statistik-zuordner')
      await expect(dd.getByRole('button', { name: /überprüfen/i })).toBeDisabled()
    })
  })

  // --- ArrayFillExercise ---
  test.describe('ArrayFillExercise — Achsen-Aggregation', () => {
    test('Übung wird angezeigt', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-achsen-aggregation')
      await expect(af).toBeVisible()
    })

    test('Korrekte Werte werden akzeptiert', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-achsen-aggregation')
      await af.getByTestId('cell-0-0').fill('15')
      await af.getByTestId('cell-0-1').fill('14')
      await af.getByTestId('cell-0-2').fill('14')
      await af.getByRole('button', { name: /überprüfen/i }).click()
      await expect(af.getByTestId('arrayfill-result')).toContainText('korrekt')
    })
  })

  // --- MultipleChoice ---
  test.describe('MultipleChoice — Korrelation', () => {
    test('Frage wird angezeigt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-korrelation-quiz')
      await expect(mc).toBeVisible()
      await expect(mc.locator('h3')).toContainText('Korrelationskoeffizient')
    })

    test('Richtige Antwort wird erkannt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-korrelation-quiz')
      await mc.getByText('Je höher die Temperatur, desto niedriger der Verbrauch').click()
      await mc.getByRole('button', { name: /antwort prüfen/i }).click()
      await expect(mc.getByTestId('mc-result')).toContainText('Richtig')
    })
  })

  // --- CodingExercise 1 ---
  test('CodingExercise — Statistik-Dashboard ist sichtbar', async ({ page }) => {
    const coding = page.getByTestId('coding-exercise-statistik-dashboard')
    await expect(coding).toBeVisible()
    await expect(coding.locator('h3')).toContainText('Statistik-Dashboard')
  })

  // --- CodingExercise 2 ---
  test('CodingExercise — Korrelation ist sichtbar', async ({ page }) => {
    const coding = page.getByTestId('coding-exercise-korrelation-coding')
    await expect(coding).toBeVisible()
    await expect(coding.locator('h3')).toContainText('Korrelation')
  })
})
