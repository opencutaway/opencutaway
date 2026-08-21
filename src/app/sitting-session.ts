export type SittingSession = {
  misses: number
  foundId: string | null
  revealed: boolean
  showAllNames: boolean
}

export function createSittingSession(): SittingSession {
  return {
    misses: 0,
    foundId: null,
    revealed: false,
    showAllNames: false
  }
}

export function onOffNeedTap(session: SittingSession): SittingSession {
  if (session.foundId) return session
  return { ...session, misses: session.misses + 1 }
}

export function onThroughLineTap(
  session: SittingSession,
  hotspotId: string
): SittingSession {
  return { ...session, foundId: hotspotId }
}

export function onAdultReveal(session: SittingSession): SittingSession {
  return { ...session, revealed: true }
}

export function toggleShowAllNames(session: SittingSession): SittingSession {
  return { ...session, showAllNames: !session.showAllNames }
}

export function shouldShowTryAgain(session: SittingSession): boolean {
  return session.foundId === null && session.misses === 1
}

export function shouldShowHint(session: SittingSession): boolean {
  return session.foundId === null && session.misses >= 2
}

export function shouldShowAdultReveal(session: SittingSession): boolean {
  return shouldShowHint(session) && !session.revealed
}
