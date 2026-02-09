import { test, expect } from '@playwright/test'

test.describe('Übungskomponenten auf ArrayGrundlagen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/array-grundlagen')
    await expect(page.locator('h1')).toContainText('Array-Grundlagen')
  })

  test('CodeBlock zeigt Syntax-highlighteten Code', async ({ page }) => {
    const codeBlocks = page.getByTestId('code-block')
    await expect(codeBlocks.first()).toBeVisible()
  })

  // --- Multiple Choice ---
  test.describe('MultipleChoice', () => {
    test('Frage und Optionen werden angezeigt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-dtype-quiz')
      await expect(mc).toBeVisible()
      await expect(mc.locator('h3')).toContainText('Welchen Dtype hat')
      await expect(mc.getByText('int64')).toBeVisible()
      await expect(mc.getByText('float64')).toBeVisible()
    })

    test('Richtige Antwort wird als korrekt markiert', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-dtype-quiz')
      await mc.getByText('float64').click()
      await mc.getByRole('button', { name: /antwort prüfen/i }).click()
      await expect(mc.getByTestId('mc-result')).toContainText('Richtig')
    })

    test('Falsche Antwort zeigt Erklärung', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-dtype-quiz')
      await mc.getByText('int64').click()
      await mc.getByRole('button', { name: /antwort prüfen/i }).click()
      await expect(mc.getByTestId('mc-result')).toContainText('falsch')
      await expect(mc.getByText(/erzwingt float64/)).toBeVisible()
    })
  })

  // --- Lückentext ---
  test.describe('Lueckentext', () => {
    test('Lücken sind editierbar', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-array-creation')
      await expect(lt).toBeVisible()
      const funcGap = lt.getByTestId('gap-func')
      await expect(funcGap).toBeVisible()
      await expect(funcGap).toBeEditable()
    })

    test('Korrekte Eingaben werden als richtig markiert', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-array-creation')
      await lt.getByTestId('gap-func').fill('zeros')
      await lt.getByTestId('gap-rows').fill('3')
      await lt.getByTestId('gap-cols').fill('4')
      await lt.getByRole('button', { name: /überprüfen/i }).click()
      await expect(lt.getByTestId('lueckentext-result')).toContainText('korrekt')
    })

    test('Falsche Eingabe zeigt Hinweis', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-array-creation')
      await lt.getByTestId('gap-func').fill('ones')
      await lt.getByTestId('gap-rows').fill('3')
      await lt.getByTestId('gap-cols').fill('4')
      await lt.getByRole('button', { name: /überprüfen/i }).click()
      await expect(lt.getByTestId('lueckentext-result')).toContainText('Nicht alle')
      await expect(lt.getByText(/Welche Funktion/)).toBeVisible()
    })
  })

  // --- Drag & Drop ---
  test.describe('DragDropExercise', () => {
    test('Drag-Items und Drop-Zones werden angezeigt', async ({ page }) => {
      const dd = page.getByTestId('dragdrop-exercise-array-functions')
      await expect(dd).toBeVisible()
      await expect(dd.getByTestId('drag-item-np-zeros')).toBeVisible()
      await expect(dd.getByTestId('drop-zone-zone-nullen')).toBeVisible()
    })

    test('Überprüfen-Button ist initially disabled', async ({ page }) => {
      const dd = page.getByTestId('dragdrop-exercise-array-functions')
      await expect(dd.getByRole('button', { name: /überprüfen/i })).toBeDisabled()
    })
  })

  // --- ArrayFill ---
  test.describe('ArrayFillExercise', () => {
    test('Leere Zellen sind editierbar', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-array-result')
      await expect(af).toBeVisible()
      const cell = af.getByTestId('cell-0-0')
      await expect(cell).toBeEditable()
    })

    test('Korrekte Werte werden als richtig markiert', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-array-result')
      await af.getByTestId('cell-0-0').fill('2')
      await af.getByTestId('cell-0-1').fill('5')
      await af.getByTestId('cell-0-2').fill('8')
      await af.getByTestId('cell-0-3').fill('11')
      await af.getByRole('button', { name: /überprüfen/i }).click()
      await expect(af.getByTestId('arrayfill-result')).toContainText('korrekt')
    })

    test('Falsche Werte werden als falsch markiert', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-array-result')
      await af.getByTestId('cell-0-0').fill('1')
      await af.getByTestId('cell-0-1').fill('5')
      await af.getByTestId('cell-0-2').fill('8')
      await af.getByTestId('cell-0-3').fill('11')
      await af.getByRole('button', { name: /überprüfen/i }).click()
      await expect(af.getByTestId('arrayfill-result')).toContainText('falsch')
    })
  })

  // --- Shape Predictor ---
  test.describe('ShapePredictor', () => {
    test('Shape-Eingabe ist vorhanden', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-shape-1')
      await expect(sp).toBeVisible()
      await expect(sp.getByTestId('shape-input')).toBeVisible()
    })

    test('Korrekte Shape wird als richtig erkannt', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-shape-1')
      await sp.getByTestId('shape-input').fill('5, 24')
      await sp.getByRole('button', { name: /prüfen/i }).click()
      await expect(sp.getByTestId('shape-result')).toContainText('Richtig')
    })

    test('Akzeptiert verschiedene Formate', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-shape-2')
      // With parentheses
      await sp.getByTestId('shape-input').fill('(2, 3)')
      await sp.getByRole('button', { name: /prüfen/i }).click()
      await expect(sp.getByTestId('shape-result')).toContainText('Richtig')
    })

    test('Falsche Shape zeigt korrekte Lösung', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-shape-1')
      await sp.getByTestId('shape-input').fill('24, 5')
      await sp.getByRole('button', { name: /prüfen/i }).click()
      await expect(sp.getByTestId('shape-result')).toContainText('(5, 24)')
    })
  })
})
