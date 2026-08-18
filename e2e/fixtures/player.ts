import { test as base } from '@playwright/test'
import { TitleScreen } from '../pages/title-screen.ts'

type PlayerFixtures = {
  titleScreen: TitleScreen
}

export const test = base.extend<PlayerFixtures>({
  titleScreen: async ({ page }, use) => {
    const titleScreen = new TitleScreen(page)
    await titleScreen.goto()
    await use(titleScreen)
  }
})

export { expect } from '@playwright/test'
