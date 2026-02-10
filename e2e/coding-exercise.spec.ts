import { test, expect } from '@playwright/test'

test.describe('CodingExercise', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/warum-numpy')
    await expect(page.locator('h1')).toContainText('Warum NumPy')
  })

  test('Coding-Übung wird angezeigt mit Editor und Output', async ({ page }) => {
    const exercise = page.getByTestId('coding-exercise-warum-numpy-1')
    await expect(exercise).toBeVisible()

    // Title and description
    await expect(exercise.locator('h3')).toContainText('Erste Schritte mit NumPy')

    // Editor is present
    await expect(exercise.getByTestId('python-editor')).toBeVisible()

    // Output panel is present
    await expect(exercise.getByTestId('python-output')).toBeVisible()

    // Run button is present
    await expect(exercise.getByRole('button', { name: /ausführen/i })).toBeVisible()

    // Reset button is present
    await expect(exercise.getByRole('button', { name: /zurücksetzen/i })).toBeVisible()
  })

  test('Hinweis-Button zeigt Hinweise an', async ({ page }) => {
    const exercise = page.getByTestId('coding-exercise-warum-numpy-1')

    const hintButton = exercise.getByRole('button', { name: /hinweis anzeigen/i })
    await expect(hintButton).toBeVisible()

    await hintButton.click()
    await expect(exercise.getByText('np.arange(start, stop)')).toBeVisible()

    // Toggle off
    await exercise.getByRole('button', { name: /hinweis ausblenden/i }).click()
    await expect(exercise.getByText('np.arange(start, stop)')).not.toBeVisible()
  })

  test('Lösung-Button erscheint erst nach erstem Ausführungsversuch', async ({ page }) => {
    const exercise = page.getByTestId('coding-exercise-warum-numpy-1')

    // Initially no solution button
    await expect(exercise.getByRole('button', { name: /lösung/i })).not.toBeVisible()
  })

  test('Pyodide lädt und führt Code aus', async ({ page }) => {
    // This test has a longer timeout because Pyodide needs to download (~15MB)
    test.setTimeout(120_000)

    const exercise = page.getByTestId('coding-exercise-warum-numpy-1')

    // The starter code has placeholders, so click "Lösung anzeigen" first
    // We need to run the code once first to make the solution button available
    await exercise.getByRole('button', { name: /ausführen/i }).click()

    // Wait for some output (error or loading)
    await expect(exercise.getByTestId('python-output')).not.toContainText('Klicke auf', { timeout: 90_000 })

    // Now show solution and run again
    const solutionBtn = exercise.getByRole('button', { name: /lösung anzeigen/i })
    await expect(solutionBtn).toBeVisible({ timeout: 5_000 })
    await solutionBtn.click()
    await exercise.getByRole('button', { name: /ausführen/i }).click()

    // Wait for output
    await expect(exercise.getByText('Array:')).toBeVisible({ timeout: 90_000 })
    await expect(exercise.getByText('Summe: 55')).toBeVisible()

    // Validation should pass
    await expect(exercise.getByTestId('validation-result')).toContainText('Bestanden')
  })

  test('Lösung-Button erscheint nach Ausführung', async ({ page }) => {
    test.setTimeout(120_000)

    const exercise = page.getByTestId('coding-exercise-warum-numpy-1')

    // Run the code
    await exercise.getByRole('button', { name: /ausführen/i }).click()

    // Wait for completion
    await expect(exercise.getByTestId('validation-result')).toBeVisible({ timeout: 90_000 })

    // Solution button should now be visible
    await expect(exercise.getByRole('button', { name: /lösung anzeigen/i })).toBeVisible()
  })
})
