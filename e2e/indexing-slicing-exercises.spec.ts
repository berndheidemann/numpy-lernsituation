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

  // --- ArrayFillExercise — Negative Indices ---
  test.describe('ArrayFillExercise — Negative Indices', () => {
    test('Übung wird angezeigt', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-negative-indices-fill')
      await expect(af).toBeVisible()
      await expect(af.locator('h3')).toContainText('Negative Indices')
    })

    test('Korrekte Werte werden akzeptiert', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-negative-indices-fill')
      await af.getByTestId('cell-0-0').fill('0.35')
      await af.getByTestId('cell-0-1').fill('0.28')
      await af.getByTestId('cell-0-2').fill('0.20')
      await af.getByRole('button', { name: /überprüfen/i }).click()
      await expect(af.getByTestId('arrayfill-result')).toContainText('korrekt')
    })
  })

  // --- Lueckentext — Slicing ---
  test.describe('Lueckentext — Slicing-Syntax', () => {
    test('Lücken sind editierbar', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-slicing-lueckentext')
      await expect(lt).toBeVisible()
      await expect(lt.getByTestId('gap-step')).toBeEditable()
    })

    test('Korrekte Eingaben werden akzeptiert', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-slicing-lueckentext')
      await lt.getByTestId('gap-step').fill('2')
      await lt.getByTestId('gap-reverse').fill('-1')
      await lt.getByTestId('gap-neg').fill('-6')
      await lt.getByRole('button', { name: /überprüfen/i }).click()
      await expect(lt.getByTestId('lueckentext-result')).toContainText('korrekt')
    })
  })

  // --- MultipleChoice — Boolean-Maske ---
  test.describe('MultipleChoice — Boolean-Maske', () => {
    test('Frage wird angezeigt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-boolean-maske-mc')
      await expect(mc).toBeVisible()
      await expect(mc.locator('h3')).toContainText('np.array([10, 20, 30, 40]) > 25')
    })

    test('Richtige Antwort wird erkannt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-boolean-maske-mc')
      await mc.getByText('[False, False, True, True]').click()
      await mc.getByRole('button', { name: /antwort prüfen/i }).click()
      await expect(mc.getByTestId('mc-result')).toContainText('Richtig')
    })
  })

  // --- ArrayFillExercise — Boolean Mask Result ---
  test.describe('ArrayFillExercise — Boolean Mask Result', () => {
    test('Übung wird angezeigt', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-boolean-mask-result')
      await expect(af).toBeVisible()
      await expect(af.locator('h3')).toContainText('Boolean Indexing Ergebnis')
    })

    test('Korrekte Werte werden akzeptiert', async ({ page }) => {
      const af = page.getByTestId('arrayfill-exercise-boolean-mask-result')
      await af.getByTestId('cell-0-0').fill('15')
      await af.getByTestId('cell-0-1').fill('22')
      await af.getByTestId('cell-0-2').fill('18')
      await af.getByTestId('cell-0-3').fill('20')
      await af.getByRole('button', { name: /überprüfen/i }).click()
      await expect(af.getByTestId('arrayfill-result')).toContainText('korrekt')
    })
  })

  // --- DragDropExercise — Indexing-Arten zuordnen ---
  test.describe('DragDropExercise — Indexing-Arten', () => {
    test('Übung wird angezeigt', async ({ page }) => {
      const dd = page.getByTestId('dragdrop-exercise-indexing-arten-zuordnen')
      await expect(dd).toBeVisible()
      await expect(dd.getByTestId('drag-item-code-basic')).toBeVisible()
      await expect(dd.getByTestId('drop-zone-zone-basic')).toBeVisible()
    })

    test('Überprüfen-Button ist initial deaktiviert', async ({ page }) => {
      const dd = page.getByTestId('dragdrop-exercise-indexing-arten-zuordnen')
      await expect(dd.getByRole('button', { name: /überprüfen/i })).toBeDisabled()
    })
  })

  // --- Lueckentext — Boolean Indexing ---
  test.describe('Lueckentext — Boolean Indexing', () => {
    test('Lücken sind editierbar', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-boolean-indexing-lueckentext')
      await expect(lt).toBeVisible()
      await expect(lt.getByTestId('gap-op')).toBeEditable()
    })

    test('Korrekte Eingaben werden akzeptiert', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-boolean-indexing-lueckentext')
      await lt.getByTestId('gap-op').fill('>')
      await lt.getByTestId('gap-wert').fill('15')
      await lt.getByTestId('gap-var').fill('maske')
      await lt.getByRole('button', { name: /überprüfen/i }).click()
      await expect(lt.getByTestId('lueckentext-result')).toContainText('korrekt')
    })
  })

  // --- CodingExercise ---
  test('CodingExercise ist sichtbar', async ({ page }) => {
    const coding = page.getByTestId('coding-exercise-indexing-coding')
    await expect(coding).toBeVisible()
    await expect(coding.locator('h3')).toContainText('Haushalt-Daten extrahieren')
  })
})
