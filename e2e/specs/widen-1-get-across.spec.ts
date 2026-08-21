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

const SITTING_1_THROUGH_LINE = ['obj-traffic-signal', 'obj-crosswalk', 'obj-crossing-gates']
const SITTING_1_OFF_NEED = [
  'obj-shop',
  'obj-mailbox',
  'obj-fire-hydrant',
  'obj-utility-pole',
  'obj-railroad-tracks'
]

test.describe('widen sitting 1 Get across', () => {
  test('teaches find, name, and function on the busy block', async ({
    titleScreen,
    widenSitting1,
    page
  }) => {
    await titleScreen.learnControl().click()

    await test.step('teaching: through-line is named; the shop is quiet', async () => {
      await expect(widenSitting1.heading()).toBeVisible()
      await expect(widenSitting1.overture()).toBeVisible()
      await expect(widenSitting1.prompt()).toBeVisible()
      await expect(widenSitting1.hotspot('obj-traffic-signal').locator('.hotspot-name')).toHaveText(
        'Traffic signal'
      )
      await expect(widenSitting1.hotspot('obj-shop').locator('.hotspot-name')).toHaveCount(0)
    })

    await test.step('interaction: miss, hint, then find the traffic signal', async () => {
      await widenSitting1.hotspot('obj-shop').click()
      await expect(page.getByText('Try again.')).toBeVisible()
      await widenSitting1.hotspot('obj-shop').click()
      await expect(
        page.getByText('This is the street object for getting across.')
      ).toBeVisible()
      await expect(page.getByText('This is the street object, not the shop.')).toHaveCount(0)
      await widenSitting1.hotspot('obj-traffic-signal').click()
      await expect(widenSitting1.objectName('Traffic signal')).toBeVisible()
      await expect(
        page.getByText('the lights that tell traffic when to stop or go')
      ).toBeVisible()
      await expect(
        page.getByText('It tells drivers and people walking when it is their turn to move.')
      ).toBeVisible()
    })

    await test.step('regression: no dam, Challenge, timer, or cute substitute name', async () => {
      await expect(page.getByRole('heading', { name: 'Challenge' })).toHaveCount(0)
      await expect(page.getByText(/walky light/i)).toHaveCount(0)
      await expect(page.getByText(/seconds left/i)).toHaveCount(0)
      await expect(page.getByText(/hydroelectric dam/i)).toHaveCount(0)
      await expect(page.getByRole('heading', { name: 'Fire hydrant' })).toHaveCount(0)
    })
  })

  test('adult reveal and Show all names', async ({ titleScreen, widenSitting1, page }) => {
    const copy = {
      offNeedId: 'obj-shop',
      offNeedName: 'Shop',
      revealedNames: 'Traffic signal, Crosswalk, Crossing gates',
      foundHeading: 'Traffic signal'
    }
    await titleScreen.learnControl().click()

    await test.step('teaching: Show all names is ready; reveal waits for a second miss', async () => {
      await teachingAdultControls(widenSitting1, copy)
    })

    await test.step('interaction: Show all names toggles; adult reveal lists crossing objects', async () => {
      await interactAdultControls(widenSitting1, copy)
    })

    await test.step('regression: reveal does not find an object or open Challenge', async () => {
      await regressionAdultControls(page, widenSitting1, copy)
    })
  })

  test('every target is reachable by touch and keyboard', async ({
    titleScreen,
    widenSitting1,
    page
  }) => {
    await titleScreen.learnControl().click()
    await expect(widenSitting1.heading()).toBeVisible()

    await test.step('teaching: each hotspot is at least 44 px and nothing paints over it', async () => {
      await expectHotspotsReachable(page, [...SITTING_1_THROUGH_LINE, ...SITTING_1_OFF_NEED])
      await expectControlsAtLeast44(page, ['Show all names', 'Back to title'])
    })

    await test.step('interaction: Tab reaches the three crossing objects in order and shows a focus ring', async () => {
      await expectKeyboardOrder(page, SITTING_1_THROUGH_LINE, 5)
    })

    await test.step('regression: no visible name is clipped, with every name shown', async () => {
      await widenSitting1.showAllNamesControl().click()
      await expectNamesReadable(page, 8)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        )
      ).toBe(0)
    })
  })
})
