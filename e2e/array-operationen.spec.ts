import { test, expect } from '@playwright/test'

test.describe('ArrayOperationen — Übungen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/array-operationen')
    await expect(page.locator('h1')).toContainText('Array-Operationen')
  })

  test('Theorie-CodeBlocks sind sichtbar', async ({ page }) => {
    const codeBlocks = page.getByTestId('code-block')
    await expect(codeBlocks.first()).toBeVisible()
  })

  // --- MultipleChoice ---
  test.describe('MultipleChoice — Logische Operatoren', () => {
    test('Frage wird angezeigt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-logische-operatoren')
      await expect(mc).toBeVisible()
      await expect(mc.locator('h3')).toContainText('filtert man')
    })

    test('Richtige Antwort wird erkannt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-logische-operatoren')
      await mc.getByText('(verbrauch > 10) & (verbrauch < 25)').click()
      await mc.getByRole('button', { name: /antwort prüfen/i }).click()
      await expect(mc.getByTestId('mc-result')).toContainText('Richtig')
    })

    test('Falsche Antwort zeigt Erklärung', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-logische-operatoren')
      await mc.getByText('np.filter(verbrauch, 10, 25)').click()
      await mc.getByRole('button', { name: /antwort prüfen/i }).click()
      await expect(mc.getByTestId('mc-result')).toContainText('falsch')
    })
  })

  // --- ArrayFillExercise ---
  test.describe('ArrayFillExercise — axis=0', () => {
    test('Übung wird angezeigt', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-axis-result')
      await expect(af).toBeVisible()
    })

    test('Korrekte Werte werden akzeptiert', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-axis-result')
      await af.getByTestId('cell-0-0').fill('39')
      await af.getByTestId('cell-0-1').fill('42')
      await af.getByTestId('cell-0-2').fill('43')
      await af.getByRole('button', { name: /überprüfen/i }).click()
      await expect(af.getByTestId('arrayfill-result')).toContainText('korrekt')
    })
  })

  // --- ShapePredictor ---
  test.describe('ShapePredictor — Aggregation', () => {
    test('Übung wird angezeigt', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-aggregation-shape')
      await expect(sp).toBeVisible()
    })

    test('Korrekte Shape wird akzeptiert', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-aggregation-shape')
      await sp.getByTestId('shape-input').fill('5')
      await sp.getByRole('button', { name: /prüfen/i }).click()
      await expect(sp.getByTestId('shape-result')).toContainText('Richtig')
    })
  })

  // --- Lueckentext ---
  test.describe('Lueckentext — Operationen', () => {
    test('Lücken sind editierbar', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-operationen-lueckentext')
      await expect(lt).toBeVisible()
      await expect(lt.getByTestId('gap-op')).toBeEditable()
    })

    test('Korrekte Eingaben werden akzeptiert', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-operationen-lueckentext')
      await lt.getByTestId('gap-op').fill('*')
      await lt.getByTestId('gap-func').fill('sum')
      await lt.getByTestId('gap-axis').fill('1')
      await lt.getByRole('button', { name: /überprüfen/i }).click()
      await expect(lt.getByTestId('lueckentext-result')).toContainText('korrekt')
    })
  })

  // --- CodingExercise ---
  test('CodingExercise ist sichtbar', async ({ page }) => {
    const coding = page.getByTestId('coding-exercise-stromkosten-coding')
    await expect(coding).toBeVisible()
    await expect(coding.locator('h3')).toContainText('Stromkosten-Rechner')
  })
})
