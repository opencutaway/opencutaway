import {
  interactAdultControls,
  regressionAdultControls,
  teachingAdultControls
} from '../helpers/adult-sitting-controls.ts'
import {
  expectControlsAtLeast44,
  expectHotspotsReachable,
  expectKeyboardOrder,
  expectNamesReadable
} from '../helpers/hotspot-reach.ts'
import { expect, test } from '../fixtures/player.ts'

const SITTING_2_THROUGH_LINE = [
  'obj-utility-pole',
  'obj-overhead-conductor',
  'obj-distribution-transformer'
]
const SITTING_2_OFF_NEED = [
  'obj-traffic-signal',
  'obj-crosswalk',
  'obj-crossing-gates',
  'obj-shop',
  'obj-mailbox',
  'obj-fire-hydrant',
  'obj-railroad-tracks'
]

test.describe('widen sitting 2 Lights', () => {
  test('teaches find, name, and function on the busy block', async ({
    titleScreen,
    widenSitting2,
    page
  }) => {
    await titleScreen.lightsControl().click()

    await test.step('teaching: through-line is named; the crossing stays quiet', async () => {
      await expect(widenSitting2.heading()).toBeVisible()
      await expect(widenSitting2.overture()).toBeVisible()
      await expect(widenSitting2.prompt()).toBeVisible()
      await expect(widenSitting2.hotspot('obj-utility-pole').locator('.hotspot-name')).toHaveText(
        'Utility pole'
      )
      await expect(
        widenSitting2.hotspot('obj-overhead-conductor').locator('.hotspot-name')
      ).toHaveText('Overhead conductor')
      await expect(
        widenSitting2.hotspot('obj-distribution-transformer').locator('.hotspot-name')
      ).toHaveText('Distribution transformer')
      await expect(widenSitting2.hotspot('obj-traffic-signal').locator('.hotspot-name')).toHaveCount(
        0
      )
      await expect(widenSitting2.hotspot('obj-shop').locator('.hotspot-name')).toHaveCount(0)
    })

    await test.step('interaction: miss, hint, then find the overhead conductor', async () => {
      await widenSitting2.hotspot('obj-shop').click()
      await expect(page.getByText('Try again.')).toBeVisible()
      await widenSitting2.hotspot('obj-shop').click()
      await expect(page.getByText('This is the street object for lights.')).toBeVisible()
      await expect(
        page.getByText('This is the street object for lights, not the crossing.')
      ).toHaveCount(0)
      await widenSitting2.hotspot('obj-overhead-conductor').click()
      await expect(widenSitting2.objectName('Overhead conductor')).toBeVisible()
      await expect(page.getByText('the wire that carries electricity along the street')).toBeVisible()
      await expect(
        page.getByText('It carries electricity along this block toward buildings that need light.')
      ).toBeVisible()
    })

    await test.step('regression: no dam, Challenge, timer, or cute substitute name', async () => {
      await expect(page.getByRole('heading', { name: 'Challenge' })).toHaveCount(0)
      await expect(page.getByText(/sparkle pole/i)).toHaveCount(0)
      await expect(page.getByText(/zappy wire/i)).toHaveCount(0)
      await expect(page.getByText(/seconds left/i)).toHaveCount(0)
      await expect(page.getByText(/hydroelectric dam/i)).toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Fire hydrant' })).toHaveCount(0)
    })
  })

  test('adult reveal and Show all names', async ({ titleScreen, widenSitting2, page }) => {
    const copy = {
      offNeedId: 'obj-traffic-signal',
      offNeedName: 'Traffic signal',
      revealedNames: 'Utility pole, Overhead conductor, Distribution transformer',
      foundHeading: 'Utility pole'
    }
    await titleScreen.lightsControl().click()

    await test.step('teaching: Show all names is ready; reveal waits for a second miss', async () => {
      await teachingAdultControls(widenSitting2, copy)
    })

    await test.step('interaction: Show all names toggles; adult reveal lists lighting objects', async () => {
      await interactAdultControls(widenSitting2, copy)
    })

    await test.step('regression: reveal does not find an object or open Challenge', async () => {
      await regressionAdultControls(page, widenSitting2, copy)
    })

    await test.step('interaction: distribution transformer names itself then voltage-down', async () => {
      await widenSitting2.hotspot('obj-distribution-transformer').click()
      await expect(widenSitting2.objectName('Distribution transformer')).toBeVisible()
      await expect(
        page.getByText(
          'distribution transformer; it steps voltage down so nearby buildings can use it'
        )
      ).toBeVisible()
    })
  })

  test('every target is reachable by touch and keyboard', async ({
    titleScreen,
    widenSitting2,
    page
  }) => {
    await titleScreen.lightsControl().click()
    await expect(widenSitting2.heading()).toBeVisible()

    await test.step('teaching: each hotspot is at least 44 px and nothing paints over it', async () => {
      await expectHotspotsReachable(page, [...SITTING_2_THROUGH_LINE, ...SITTING_2_OFF_NEED])
      await expectControlsAtLeast44(page, ['Show all names', 'Back to title'])
    })

    await test.step('interaction: Tab reaches pole, conductor, transformer in order and shows a focus ring', async () => {
      await expectKeyboardOrder(page, SITTING_2_THROUGH_LINE, 7)
    })

    await test.step('regression: Distribution transformer and every other name fit their boxes', async () => {
      await widenSitting2.showAllNamesControl().click()
      await expectNamesReadable(page, 10)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        )
      ).toBe(0)
    })
  })
})
