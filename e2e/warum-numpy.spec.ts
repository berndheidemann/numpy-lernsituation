import { test, expect } from '@playwright/test'

test.describe('WarumNumpy — Übungen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/warum-numpy')
    await expect(page.locator('h1')).toContainText('Warum NumPy')
  })

  test('PerformanceChart ist sichtbar', async ({ page }) => {
    await expect(page.getByTestId('performance-chart')).toBeVisible()
  })

  // --- MultipleChoice ---
  test.describe('MultipleChoice — Listen vs. Arrays', () => {
    test('Frage wird angezeigt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-listen-vs-arrays-quiz')
      await expect(mc).toBeVisible()
      await expect(mc.locator('h3')).toContainText('Hauptgrund')
    })

    test('Richtige Antwort wird erkannt', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-listen-vs-arrays-quiz')
      await mc.getByText('Homogener Datentyp').click()
      await mc.getByRole('button', { name: /antwort prüfen/i }).click()
      await expect(mc.getByTestId('mc-result')).toContainText('Richtig')
    })

    test('Falsche Antwort zeigt Erklärung', async ({ page }) => {
      const mc = page.getByTestId('mc-exercise-listen-vs-arrays-quiz')
      await mc.getByText('NumPy ist in Java geschrieben').click()
      await mc.getByRole('button', { name: /antwort prüfen/i }).click()
      await expect(mc.getByTestId('mc-result')).toContainText('falsch')
    })
  })

  // --- Lueckentext ---
  test.describe('Lueckentext — Vektorisierung', () => {
    test('Lücken sind editierbar', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-vektorisierung-lueckentext')
      await expect(lt).toBeVisible()
      await expect(lt.getByTestId('gap-konzept')).toBeEditable()
    })

    test('Korrekte Eingaben werden akzeptiert', async ({ page }) => {
      const lt = page.getByTestId('lueckentext-vektorisierung-lueckentext')
      await lt.getByTestId('gap-konzept').fill('Vektorisierung')
      await lt.getByTestId('gap-func').fill('array')
      await lt.getByTestId('gap-op').fill('*')
      await lt.getByRole('button', { name: /überprüfen/i }).click()
      await expect(lt.getByTestId('lueckentext-result')).toContainText('korrekt')
    })
  })

  // --- CodingExercise ---
  test('CodingExercise ist sichtbar', async ({ page }) => {
    const coding = page.getByTestId('coding-exercise-warum-numpy-1')
    await expect(coding).toBeVisible()
    await expect(coding.locator('h3')).toContainText('Erste Schritte')
  })
})
