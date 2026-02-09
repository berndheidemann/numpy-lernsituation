import { test, expect } from '@playwright/test'

test.describe('ReshapeManipulation — Übungen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/reshape-manipulation')
    await expect(page.locator('h1')).toContainText('Reshape & Manipulation')
  })

  test('CodeBlock mit Theorie ist sichtbar', async ({ page }) => {
    const codeBlocks = page.getByTestId('code-block')
    await expect(codeBlocks.first()).toBeVisible()
  })

  // --- ShapePredictor 1 ---
  test.describe('ShapePredictor — Tagesmatrix', () => {
    test('Übung wird angezeigt', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-reshape-shape-1')
      await expect(sp).toBeVisible()
    })

    test('Korrekte Shape wird akzeptiert', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-reshape-shape-1')
      await sp.getByTestId('shape-input').fill('365, 24')
      await sp.getByRole('button', { name: /prüfen/i }).click()
      await expect(sp.getByTestId('shape-result')).toContainText('Richtig')
    })
  })

  // --- ShapePredictor 2 ---
  test.describe('ShapePredictor — Automatische Dimension', () => {
    test('Übung wird angezeigt', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-reshape-shape-2')
      await expect(sp).toBeVisible()
    })

    test('Korrekte Shape wird akzeptiert', async ({ page }) => {
      const sp = page.getByTestId('shape-predictor-reshape-shape-2')
      await sp.getByTestId('shape-input').fill('4, 3')
      await sp.getByRole('button', { name: /prüfen/i }).click()
      await expect(sp.getByTestId('shape-result')).toContainText('Richtig')
    })
  })

  // --- Lueckentext ---
  test.describe('Lueckentext — Reshape', () => {
    test('Lücken sind editierbar', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-reshape-lueckentext')
      await expect(lt).toBeVisible()
      await expect(lt.getByTestId('gap-func')).toBeEditable()
    })

    test('Korrekte Eingaben werden akzeptiert', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-reshape-lueckentext')
      await lt.getByTestId('gap-func').fill('reshape')
      await lt.getByTestId('gap-rows').fill('3')
      await lt.getByTestId('gap-cols').fill('4')
      await lt.getByTestId('gap-trans').fill('T')
      await lt.getByRole('button', { name: /überprüfen/i }).click()
      await expect(lt.getByTestId('lueckentext-result')).toContainText('korrekt')
    })

    test('Falsche Eingabe zeigt Hinweis', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-reshape-lueckentext')
      await lt.getByTestId('gap-func').fill('resize')
      await lt.getByTestId('gap-rows').fill('3')
      await lt.getByTestId('gap-cols').fill('4')
      await lt.getByTestId('gap-trans').fill('T')
      await lt.getByRole('button', { name: /überprüfen/i }).click()
      await expect(lt.getByTestId('lueckentext-result')).toContainText('Nicht alle')
    })
  })

  // --- CodingExercise ---
  test('CodingExercise ist sichtbar', async ({ page }) => {
    const coding = page.getByTestId('coding-exercise-reshape-coding')
    await expect(coding).toBeVisible()
    await expect(coding.locator('h3')).toContainText('Wochendaten')
  })
})
