import { test, expect } from '@playwright/test'

test.describe('Praxisprojekt — Übungen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/praxisprojekt')
    await expect(page.locator('h1')).toContainText('Praxisprojekt')
  })

  test('Analyse-Pipeline CodeBlock ist sichtbar', async ({ page }) => {
    const codeBlocks = page.getByTestId('code-block')
    await expect(codeBlocks.first()).toBeVisible()
  })

  // --- CodingExercise 1: Tarifvergleich Teil 1 ---
  test('CodingExercise — Teil 1 ist sichtbar', async ({ page }) => {
    const coding = page.getByTestId('coding-exercise-praxis-tarifvergleich')
    await expect(coding).toBeVisible()
    await expect(coding.locator('h3')).toContainText('Teil 1')
  })

  // --- MultipleChoice ---
  test.describe('MultipleChoice — Broadcasting-Check', () => {
    test('Frage wird angezeigt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-praxis-broadcasting-check')
      await expect(mc).toBeVisible()
      await expect(mc.locator('h3')).toContainText('funktioniert')
    })

    test('Richtige Antwort wird erkannt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-praxis-broadcasting-check')
      await mc.getByText('auffüllt und auf (10, 168) streckt').click()
      await mc.getByRole('button', { name: /antwort prüfen/i }).click()
      await expect(mc.getByTestId('mc-result')).toContainText('Richtig')
    })
  })

  // --- CodingExercise 2: Tarifvergleich Teil 2 ---
  test('CodingExercise — Teil 2 ist sichtbar', async ({ page }) => {
    const coding = page.getByTestId('coding-exercise-praxis-tarifvergleich-2')
    await expect(coding).toBeVisible()
    await expect(coding.locator('h3')).toContainText('Teil 2')
  })

  // --- CodingExercise 3: Tagesmuster ---
  test('CodingExercise — Tagesmuster ist sichtbar', async ({ page }) => {
    const coding = page.getByTestId('coding-exercise-praxis-tagesmuster')
    await expect(coding).toBeVisible()
    await expect(coding.locator('h3')).toContainText('Tagesmuster')
  })
})
