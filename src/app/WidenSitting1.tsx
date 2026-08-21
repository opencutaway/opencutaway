import { useState } from 'preact/hooks'
import { BusyBlock } from './renderers/BusyBlock'
import {
  WIDEN_SITTING_1,
  hotspotById,
  throughLineHotspots,
  type WidenSitting
} from './sitting'
import {
  createSittingSession,
  onAdultReveal,
  onOffNeedTap,
  onThroughLineTap,
  shouldShowAdultReveal,
  shouldShowHint,
  shouldShowTryAgain,
  toggleShowAllNames
} from './sitting-session'

type WidenSittingScreenProps = {
  sitting: WidenSitting
  onBack: () => void
}

export function WidenSittingScreen({ sitting, onBack }: WidenSittingScreenProps) {
  const [session, setSession] = useState(createSittingSession)
  const found = session.foundId ? hotspotById(session.foundId, sitting) : undefined
  const revealNames = throughLineHotspots(sitting).map((hotspot) => hotspot.displayName)

  return (
    <main class="sitting">
      <header class="sitting-header">
        <h1>{sitting.throughLine}</h1>
        <p>{sitting.overture}</p>
        <p>{sitting.prompt}</p>
      </header>

      <BusyBlock
        hotspots={sitting.hotspots}
        foundId={session.foundId}
        revealed={session.revealed}
        showAllNames={session.showAllNames}
        onThroughLine={(id) => setSession((current) => onThroughLineTap(current, id))}
        onOffNeed={() => setSession((current) => onOffNeedTap(current))}
      />

      <div class="sitting-feedback" role="status">
        {shouldShowTryAgain(session) ? <p>{sitting.tryAgain}</p> : null}
        {shouldShowHint(session) ? <p>{sitting.secondMissHint}</p> : null}
        {session.revealed && !found ? (
          <p>{revealNames.join(', ')}</p>
        ) : null}
        {found ? (
          <article class="object-card">
            <h2>{found.displayName}</h2>
            {found.gloss ? <p>{found.gloss}</p> : null}
            {found.functionSummary ? <p>{found.functionSummary}</p> : null}
          </article>
        ) : null}
      </div>

      <div class="sitting-controls">
        <button
          type="button"
          aria-pressed={session.showAllNames}
          onClick={() => setSession((current) => toggleShowAllNames(current))}
        >
          {sitting.showAllNamesLabel}
        </button>
        {shouldShowAdultReveal(session) ? (
          <button type="button" onClick={() => setSession((current) => onAdultReveal(current))}>
            {sitting.adultRevealLabel}
          </button>
        ) : null}
        <button type="button" onClick={onBack}>
          {sitting.backLabel}
        </button>
      </div>
    </main>
  )
}

type WidenSitting1Props = {
  onBack: () => void
}

export function WidenSitting1({ onBack }: WidenSitting1Props) {
  return <WidenSittingScreen sitting={WIDEN_SITTING_1} onBack={onBack} />
}
