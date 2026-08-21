import { useEffect, useState } from 'preact/hooks'
import {
  GAME_TITLE,
  LEARN_CONTROL_LABEL,
  LEARN_HASH,
  LIGHTS_CONTROL_LABEL,
  LIGHTS_HASH,
  TITLE_BLURB
} from './title'
import { WidenSittingScreen } from './WidenSitting1'
import { WIDEN_SITTING_1, WIDEN_SITTING_2 } from './sitting'

type Screen = 'title' | 'widen-1' | 'widen-2'

function screenFromHash(): Screen {
  if (window.location.hash === LEARN_HASH) return 'widen-1'
  if (window.location.hash === LIGHTS_HASH) return 'widen-2'
  return 'title'
}

export function App() {
  const [screen, setScreen] = useState<Screen>(screenFromHash)

  useEffect(() => {
    const onHash = () => setScreen(screenFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function openSitting(hash: string, next: Screen) {
    window.location.hash = hash
    setScreen(next)
  }

  function backToTitle() {
    window.location.hash = ''
    setScreen('title')
  }

  if (screen === 'widen-1') {
    return <WidenSittingScreen sitting={WIDEN_SITTING_1} onBack={backToTitle} />
  }

  if (screen === 'widen-2') {
    return <WidenSittingScreen sitting={WIDEN_SITTING_2} onBack={backToTitle} />
  }

  return (
    <main>
      <h1>{GAME_TITLE}</h1>
      <p>{TITLE_BLURB}</p>
      <div class="title-controls">
        <button type="button" onClick={() => openSitting(LEARN_HASH, 'widen-1')}>
          {LEARN_CONTROL_LABEL}
        </button>
        <button type="button" onClick={() => openSitting(LIGHTS_HASH, 'widen-2')}>
          {LIGHTS_CONTROL_LABEL}
        </button>
      </div>
    </main>
  )
}
