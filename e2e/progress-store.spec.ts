import { test, expect } from '@playwright/test'

test.describe('Progress Store (LocalStorage)', () => {
  test('Kapitelbesuch wird in LocalStorage gespeichert', async ({ page }) => {
    await page.goto('/#/warum-numpy')
    await expect(page.locator('h1')).toContainText('Warum NumPy')

    // Wait a tick for Zustand persist to write
    await page.waitForTimeout(500)

    const storageValue = await page.evaluate(() => {
      return localStorage.getItem('numpy-learning-progress')
    })

    expect(storageValue).not.toBeNull()

    const parsed = JSON.parse(storageValue!)
    expect(parsed.version).toBe(1)
    expect(parsed.state.chapters['warum-numpy'].visited).toBe(true)
    expect(parsed.state.lastVisited).toBe('warum-numpy')
  })

  test('Fortschritt bleibt nach Seitenwechsel erhalten', async ({ page }) => {
    // Visit a chapter to trigger state change
    await page.goto('/#/warum-numpy')
    await expect(page.locator('h1')).toContainText('Warum NumPy')
    await page.waitForTimeout(300)

    // Navigate away and back
    await page.goto('/')
    await page.goto('/#/warum-numpy')
    await page.waitForTimeout(300)

    const storageValue = await page.evaluate(() => {
      return localStorage.getItem('numpy-learning-progress')
    })

    const parsed = JSON.parse(storageValue!)
    expect(parsed.state.chapters['warum-numpy'].visited).toBe(true)
  })

  test('Manuell gesetzter Fortschritt wird beibehalten', async ({ page }) => {
    await page.goto('/')

    // Set progress manually in localStorage
    await page.evaluate(() => {
      const progress = {
        state: {
          chapters: {
            'warum-numpy': { id: 'warum-numpy', visited: true, exercisesCompleted: 2, exercisesTotal: 3 },
            'array-grundlagen': { id: 'array-grundlagen', visited: false, exercisesCompleted: 0, exercisesTotal: 0 },
          },
          totalExercisesCompleted: 2,
          badges: [],
          version: 1,
        },
        version: 1,
      }
      localStorage.setItem('numpy-learning-progress', JSON.stringify(progress))
    })

    // Reload and check persistence
    await page.reload()
    await page.waitForTimeout(300)

    const storageValue = await page.evaluate(() => {
      return localStorage.getItem('numpy-learning-progress')
    })

    const parsed = JSON.parse(storageValue!)
    expect(parsed.state.totalExercisesCompleted).toBe(2)
  })
})
