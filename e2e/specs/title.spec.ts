import { expectControlsAtLeast44 } from '../helpers/hotspot-reach.ts'
import { expect, test } from '../fixtures/player.ts'

test.describe('title screen', () => {
  test('teaches the game name and opens Cross the Street or Lights', async ({
    titleScreen,
    widenSitting1,
    widenSitting2,
    page
  }) => {
    await test.step('teaching: name, blurb, Cross the Street, and Lights', async () => {
      await expect(page).toHaveTitle('Open Cutaway')
      await expect(titleScreen.heading()).toBeVisible()
      await expect(titleScreen.blurb()).toBeVisible()
      await expect(titleScreen.learnControl()).toBeVisible()
      await expect(titleScreen.lightsControl()).toBeVisible()
      await expectControlsAtLeast44(page, ['Cross the Street', 'Lights'])
    })

    await test.step('interaction: Cross the Street opens widen sitting 1', async () => {
      await titleScreen.learnControl().click()
      await expect(widenSitting1.heading()).toBeVisible()
      await expect(widenSitting1.prompt()).toBeVisible()
    })

    await test.step('interaction: Lights opens widen sitting 2', async () => {
      await widenSitting1.backControl().click()
      await expect(titleScreen.heading()).toBeVisible()
      await titleScreen.lightsControl().click()
      await expect(widenSitting2.heading()).toBeVisible()
      await expect(widenSitting2.prompt()).toBeVisible()
    })

    await test.step('regression: no hydrant lesson or dam dump on the title path', async () => {
      await expect(page.getByText(/hydrant lesson/i)).toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Challenge' })).toHaveCount(0)
      await expect(page.getByText(/walky light/i)).toHaveCount(0)
    })
  })
})
