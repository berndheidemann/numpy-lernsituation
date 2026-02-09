import { test, expect } from '@playwright/test'

test.describe('Error Boundary', () => {
  test('App rendert ohne Fehler auf allen Seiten', async ({ page }) => {
    const routes = [
      '/',
      '/#/warum-numpy',
      '/#/array-grundlagen',
      '/#/indexing-slicing',
      '/#/array-operationen',
      '/#/broadcasting',
      '/#/reshape-manipulation',
      '/#/statistische-auswertung',
      '/#/praxisprojekt',
    ]

    for (const route of routes) {
      await page.goto(route)
      // No error boundary message should appear
      await expect(page.getByText('Etwas ist schiefgelaufen')).not.toBeVisible()
      // H1 should always be present
      await expect(page.locator('h1')).toBeVisible()
    }
  })
})
