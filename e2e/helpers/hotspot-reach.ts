import { expect, type Page } from '@playwright/test'

/**
 * S9 as rendered: every hotspot box is at least 44 CSS px on both axes, and a
 * 5 × 5 grid of points inside it all hit that hotspot (nothing paints over it).
 */
export async function expectHotspotsReachable(page: Page, ids: string[]): Promise<void> {
  for (const id of ids) {
    const hotspot = page.locator(`[data-hotspot="${id}"]`)
    await hotspot.scrollIntoViewIfNeeded()
    const measured = await hotspot.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      let hits = 0
      let total = 0
      for (let gx = 0.5; gx < 5; gx += 1) {
        for (let gy = 0.5; gy < 5; gy += 1) {
          const top = document.elementFromPoint(
            rect.x + (rect.width * gx) / 5,
            rect.y + (rect.height * gy) / 5
          )
          total += 1
          if (top && (top === el || el.contains(top))) hits += 1
        }
      }
      return { width: rect.width, height: rect.height, exposed: hits / total }
    })
    expect(measured.width, `${id} width`).toBeGreaterThanOrEqual(44)
    expect(measured.height, `${id} height`).toBeGreaterThanOrEqual(44)
    expect(measured.exposed, `${id} exposed fraction`).toBe(1)
  }
}

function activeHotspot(page: Page): Promise<string | null> {
  return page.evaluate(() => document.activeElement?.getAttribute('data-hotspot') ?? null)
}

/**
 * Through-line hotspots are reached by Tab in declared order; off-need hotspots
 * are never reached; keyboard focus paints the amber focus ring, not the
 * always-on through-line outline.
 */
export async function expectKeyboardOrder(
  page: Page,
  throughLineIds: string[],
  offNeedCount: number
): Promise<void> {
  await expect(page.locator('[data-hotspot][tabindex="0"]')).toHaveCount(throughLineIds.length)
  await expect(page.locator('[data-hotspot][tabindex="-1"]')).toHaveCount(offNeedCount)

  const showAll = page.getByRole('button', { name: 'Show all names' })
  await showAll.focus()
  await page.keyboard.press('Shift+Tab')
  const reached: (string | null)[] = [await activeHotspot(page)]
  for (let i = 1; i < throughLineIds.length; i += 1) {
    await page.keyboard.press('Shift+Tab')
    reached.push(await activeHotspot(page))
  }
  expect(reached).toEqual([...throughLineIds].reverse())

  await page.keyboard.press('Shift+Tab')
  expect(await activeHotspot(page)).toBe(null)

  await page.locator(`[data-hotspot="${throughLineIds[0]}"]`).focus()
  await page.keyboard.press('Tab')
  expect(await activeHotspot(page)).toBe(throughLineIds[1])
  const ring = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement
    const style = getComputedStyle(el)
    return { color: style.outlineColor, width: style.outlineWidth, focusVisible: el.matches(':focus-visible') }
  })
  expect(ring).toEqual({ color: 'rgb(184, 119, 10)', width: '4px', focusVisible: true })
}

/** Every visible name fits its box: no clipped words on either project. */
export async function expectNamesReadable(page: Page, expectedCount: number): Promise<void> {
  const names = page.locator('.hotspot-name')
  await expect(names).toHaveCount(expectedCount)
  const clipped = await names.evaluateAll((els) =>
    els
      .filter((el) => el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight)
      .map((el) => el.textContent)
  )
  expect(clipped).toEqual([])
}

/** S9 for the controls around the block: each named control is at least 44 × 44 CSS px as rendered. */
export async function expectControlsAtLeast44(page: Page, names: string[]): Promise<void> {
  for (const name of names) {
    const control = page.getByRole('button', { name, exact: true })
    await expect(control).toBeVisible()
    const box = await control.boundingBox()
    expect(box, `${name} bounding box`).not.toBeNull()
    expect(box!.width, `${name} width`).toBeGreaterThanOrEqual(44)
    expect(box!.height, `${name} height`).toBeGreaterThanOrEqual(44)
  }
}
