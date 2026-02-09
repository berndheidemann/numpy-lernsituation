import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('Home-Seite zeigt alle 8 Kapitel', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('NumPy Lernplattform')

    const chapters = page.locator('main a')
    await expect(chapters).toHaveCount(8)
  })

  test('Navigation enthält Links zu allen Kapiteln', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    await expect(nav.getByText('1. Warum NumPy?')).toBeVisible()
    await expect(nav.getByText('8. Praxis')).toBeVisible()
  })

  test('Klick auf Kapitel navigiert zur Kapitelseite', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav').getByText('2. Grundlagen').click()
    await expect(page.locator('h1')).toContainText('Array-Grundlagen')
  })

  test('Aktiver Nav-Link wird hervorgehoben', async ({ page }) => {
    await page.goto('/#/array-grundlagen')
    const activeLink = page.locator('nav').getByText('2. Grundlagen')
    await expect(activeLink).toHaveClass(/bg-blue-100/)
  })

  test('Alle Kapitelseiten sind erreichbar', async ({ page }) => {
    const routes = [
      { path: '/#/warum-numpy', heading: 'Warum NumPy' },
      { path: '/#/array-grundlagen', heading: 'Array-Grundlagen' },
      { path: '/#/indexing-slicing', heading: 'Indexing & Slicing' },
      { path: '/#/array-operationen', heading: 'Array-Operationen' },
      { path: '/#/broadcasting', heading: 'Broadcasting' },
      { path: '/#/reshape-manipulation', heading: 'Reshape & Manipulation' },
      { path: '/#/statistische-auswertung', heading: 'Statistische Auswertung' },
      { path: '/#/praxisprojekt', heading: 'Praxisprojekt' },
    ]

    for (const route of routes) {
      await page.goto(route.path)
      await expect(page.locator('h1')).toContainText(route.heading)
    }
  })
})
