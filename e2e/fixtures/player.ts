import { test as base } from '@playwright/test'
import { TitleScreen } from '../pages/title-screen.ts'
import { WidenSitting1Page } from '../pages/widen-sitting-1.ts'
import { WidenSitting2Page } from '../pages/widen-sitting-2.ts'

type PlayerFixtures = {
  titleScreen: TitleScreen
  widenSitting1: WidenSitting1Page
  widenSitting2: WidenSitting2Page
}

export const test = base.extend<PlayerFixtures>({
  titleScreen: async ({ page }, use) => {
    const titleScreen = new TitleScreen(page)
    await titleScreen.goto()
    await use(titleScreen)
  },
  widenSitting1: async ({ page }, use) => {
    await use(new WidenSitting1Page(page))
  },
  widenSitting2: async ({ page }, use) => {
    await use(new WidenSitting2Page(page))
  }
})

export { expect } from '@playwright/test'
