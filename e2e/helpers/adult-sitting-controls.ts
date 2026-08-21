import { expect, type Locator, type Page } from '@playwright/test'

export type AdultSittingPage = {
  hotspot(id: string): Locator
  showAllNamesControl(): Locator
  adultRevealControl(): Locator
}

export type AdultSittingCopy = {
  offNeedId: string
  offNeedName: string
  revealedNames: string
  foundHeading: string
}

export async function teachingAdultControls(
  sitting: AdultSittingPage,
  copy: AdultSittingCopy
): Promise<void> {
  await expect(sitting.showAllNamesControl()).toBeVisible()
  await expect(sitting.adultRevealControl()).toHaveCount(0)
  await expect(sitting.hotspot(copy.offNeedId).locator('.hotspot-name')).toHaveCount(0)
}

export async function interactAdultControls(
  sitting: AdultSittingPage,
  copy: AdultSittingCopy
): Promise<void> {
  const showAll = sitting.showAllNamesControl()
  await showAll.click()
  await expect(showAll).toHaveAttribute('aria-pressed', 'true')
  await expect(sitting.hotspot(copy.offNeedId).locator('.hotspot-name')).toHaveText(
    copy.offNeedName
  )
  await showAll.click()
  await expect(showAll).toHaveAttribute('aria-pressed', 'false')
  await expect(sitting.hotspot(copy.offNeedId).locator('.hotspot-name')).toHaveCount(0)

  await sitting.hotspot(copy.offNeedId).click()
  await sitting.hotspot(copy.offNeedId).click()
  await expect(sitting.adultRevealControl()).toBeVisible()
  await sitting.adultRevealControl().click()
  await expect(sitting.adultRevealControl()).toHaveCount(0)
}

export async function regressionAdultControls(
  page: Page,
  sitting: AdultSittingPage,
  copy: AdultSittingCopy
): Promise<void> {
  await expect(page.getByText(copy.revealedNames, { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: copy.foundHeading })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Challenge' })).toHaveCount(0)
  await expect(page.getByText(/seconds left/i)).toHaveCount(0)
}
