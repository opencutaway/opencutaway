import { expect, test } from '../fixtures/player.ts'

test.describe('modes not shipped', () => {
  test('does not offer Learn, Challenge, or Life list yet', async ({
    titleScreen,
    page
  }) => {
    await test.step('teaching: only the title stub is present', async () => {
      await expect(titleScreen.heading()).toBeVisible()
    })

    await test.step('interaction: no extra mode controls to press', async () => {
      await expect(page.getByRole('button')).toHaveCount(0)
      await expect(page.getByRole('link')).toHaveCount(0)
    })

    await test.step('regression: stub modes stay unshipped', async () => {
      await expect(page.getByRole('heading', { name: 'Learn' })).toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Challenge' })).toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Life list' })).toHaveCount(0)
    })
  })
})
