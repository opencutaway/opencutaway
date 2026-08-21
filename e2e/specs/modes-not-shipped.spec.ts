import { expect, test } from '../fixtures/player.ts'

test.describe('modes not shipped', () => {
  test('does not offer Challenge or Life list yet', async ({ titleScreen, page }) => {
    await test.step('teaching: the title still names the game', async () => {
      await expect(titleScreen.heading()).toBeVisible()
    })

    await test.step('interaction: Cross the Street and Lights are the Learn controls', async () => {
      await expect(titleScreen.learnControl()).toBeVisible()
      await expect(titleScreen.lightsControl()).toBeVisible()
      await expect(page.getByRole('button', { name: 'Challenge' })).toHaveCount(0)
      await expect(page.getByRole('button', { name: 'Life list' })).toHaveCount(0)
      await expect(page.getByRole('link')).toHaveCount(0)
    })

    await test.step('regression: stub modes stay unshipped', async () => {
      await expect(page.getByRole('heading', { name: 'Challenge' })).toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Life list' })).toHaveCount(0)
    })
  })
})
