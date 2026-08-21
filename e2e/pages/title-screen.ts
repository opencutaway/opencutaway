import { type Locator, type Page } from '@playwright/test'

export class TitleScreen {
  constructor(readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/')
  }

  heading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Open Cutaway' })
  }

  blurb(): Locator {
    return this.page.getByText(
      'A visual game about how infrastructure works. Start on the block with "Cross the Street" or "Lights". Progress always stays on this device.'
    )
  }

  learnControl(): Locator {
    return this.page.getByRole('button', { name: 'Cross the Street' })
  }

  lightsControl(): Locator {
    return this.page.getByRole('button', { name: 'Lights' })
  }

  main(): Locator {
    return this.page.getByRole('main')
  }
}
