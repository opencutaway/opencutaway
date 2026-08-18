import { expect, test } from '../fixtures/player.ts'

test.describe('title screen', () => {
  test('teaches the game name and that lessons are not here yet', async ({
    titleScreen,
    page
  }) => {
    await test.step('teaching: name and placeholder blurb', async () => {
      await expect(page).toHaveTitle('Open Cutaway')
      await expect(titleScreen.heading()).toBeVisible()
      await expect(titleScreen.blurb()).toBeVisible()
    })

    await test.step('interaction: the child can reach the heading in main', async () => {
      await expect(titleScreen.main()).toBeVisible()
      await titleScreen.heading().focus()
      await expect(titleScreen.heading()).toBeVisible()
    })

    await test.step('regression: no playable lesson leaked onto the title', async () => {
      await expect(page.getByRole('heading', { name: 'Learn' })).toHaveCount(0)
      await expect(page.getByText(/hydrant lesson/i)).toHaveCount(0)
      await expect(titleScreen.blurb()).toContainText('Lessons are not in this build yet')
    })
  })
})
