import { type Locator, type Page } from '@playwright/test'

export class WidenSitting2Page {
  constructor(readonly page: Page) {}

  heading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Lights' })
  }

  prompt(): Locator {
    return this.page.getByText(
      'Find the street object that brings electric light to this block.'
    )
  }

  overture(): Locator {
    return this.page.getByText('This is our town. We notice one need at a time.')
  }

  hotspot(id: string): Locator {
    return this.page.locator(`[data-hotspot="${id}"]`)
  }

  objectName(name: string): Locator {
    return this.page.getByRole('heading', { level: 2, name })
  }

  showAllNamesControl(): Locator {
    return this.page.getByRole('button', { name: 'Show all names' })
  }

  adultRevealControl(): Locator {
    return this.page.getByRole('button', { name: 'Reveal the lighting objects' })
  }

  backControl(): Locator {
    return this.page.getByRole('button', { name: 'Back to title' })
  }
}
