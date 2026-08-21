import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  findForbiddenTokens,
  forbiddenClientTokens
} from '../scripts/lib/client-gates.mjs'
import { scanClientTree } from '../scripts/lib/scan-client-tree.mjs'
import { repoRoot } from './helpers/repo-files.ts'

/**
 * Literal copy of the G-ethos list (E2: never read the constant under test).
 * Shrinking this list is an owner decision recorded in docs/settled.md.
 */
const FORBIDDEN_TOKENS = [
  'geolocation',
  'getUserMedia',
  'mediaDevices',
  'ImageCapture',
  'gtag',
  'Sentry',
  'analytics',
  'amplitude',
  'mixpanel',
  'firebase',
  'supabase',
  'openai',
  'anthropic',
  '@ai-sdk',
  'langchain',
  'langgraph',
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
  'sendBeacon',
  'indexedDB',
  'localStorage',
  'sessionStorage',
  'serviceWorker',
  'fetch(',
  'importScripts(',
  'segment.io',
  'caches.open'
]

/** One realistic client line per token (E3: a control for every detector). */
const CONTROL_SAMPLES: Record<string, string> = {
  geolocation: 'navigator.geolocation.getCurrentPosition(onFix)',
  getUserMedia: 'const stream = await navigator.mediaDevices.getUserMedia({ video: true })',
  mediaDevices: 'const cams = await navigator.mediaDevices.enumerateDevices()',
  ImageCapture: 'const capture = new ImageCapture(track)',
  gtag: "gtag('event', 'level_complete')",
  Sentry: "import * as Sentry from '@sentry/react'",
  analytics: "analytics.track('found', { card })",
  amplitude: "import * as amplitude from '@amplitude/analytics-browser'",
  mixpanel: "mixpanel.track('Sitting opened')",
  firebase: "import { initializeApp } from 'firebase/app'",
  supabase: "const client = createClient(SUPABASE_URL, key) // supabase",
  openai: "import OpenAI from 'openai'",
  anthropic: "import Anthropic from '@anthropic-ai/sdk'",
  '@ai-sdk': "import { createOpenAI } from '@ai-sdk/openai'",
  langchain: "import { ChatPromptTemplate } from '@langchain/core/prompts'",
  langgraph: "import { StateGraph } from '@langchain/langgraph'",
  XMLHttpRequest: 'const xhr = new XMLHttpRequest()',
  WebSocket: "const socket = new WebSocket('wss://example.invalid/live')",
  EventSource: "const source = new EventSource('/events')",
  sendBeacon: "navigator.sendBeacon('/collect', payload)",
  indexedDB: "const request = indexedDB.open('profiles', 1)",
  localStorage: "localStorage.setItem('profile', name)",
  sessionStorage: "sessionStorage.setItem('sitting', id)",
  serviceWorker: "navigator.serviceWorker.register('/sw.js')",
  'fetch(': "const res = await fetch('/api/cards')",
  'importScripts(': "importScripts('https://example.invalid/worker.js')",
  'segment.io': "import { AnalyticsBrowser } from '@segment/analytics-next'",
  'caches.open': "const cache = await caches.open('cards-v1')"
}

describe('child-facing client hard-stops', () => {
  it('flags forbidden client tokens in a sample string', () => {
    const sample = ['get', 'User', 'Media'].join('')
    expect(findForbiddenTokens(sample)).toContain('getUserMedia')
  })

  it('keeps the full forbidden token list', () => {
    expect(forbiddenClientTokens()).toEqual(FORBIDDEN_TOKENS)
    expect(forbiddenClientTokens()).toHaveLength(28)
  })

  it('flags every forbidden token in a realistic client line', () => {
    const silent: string[] = []
    const uncontrolled: string[] = []
    for (const token of FORBIDDEN_TOKENS) {
      const sample = CONTROL_SAMPLES[token]
      if (sample === undefined) {
        uncontrolled.push(token)
        continue
      }
      if (!findForbiddenTokens(sample).includes(token)) {
        silent.push(token)
      }
    }
    expect(uncontrolled).toEqual([])
    expect(silent).toEqual([])
    expect(Object.keys(CONTROL_SAMPLES)).toHaveLength(28)
  })

  it('matches tokens case-insensitively', () => {
    expect(findForbiddenTokens('NAVIGATOR.GEOLOCATION')).toContain('geolocation')
    expect(findForbiddenTokens('window.FETCH(url)')).toContain('fetch(')
    expect(findForbiddenTokens('LocalStorage.clear()')).toContain('localStorage')
  })

  it('does not trip fetch( on prefetch or refetch names', () => {
    expect(findForbiddenTokens('prefetchData(url)')).toEqual([])
    expect(findForbiddenTokens('prefetch(url)')).toEqual([])
    expect(findForbiddenTokens('refetchQueries(keys)')).toEqual([])
    expect(findForbiddenTokens('fetch(url)')).toEqual(['fetch('])
    expect(findForbiddenTokens('window.fetch (url)')).toEqual(['fetch('])
  })

  it('does not trip segment.io on drawing words', () => {
    expect(findForbiddenTokens('const pathSegment = segments[0]')).toEqual([])
    expect(findForbiddenTokens('cdn.segment.com/analytics.js')).toEqual([
      'analytics',
      'segment.io'
    ])
  })

  it('reports nothing for clean client text', () => {
    expect(findForbiddenTokens('const total = found.length + 1')).toEqual([])
    expect(findForbiddenTokens('')).toEqual([])
  })

  it('finds no forbidden tokens under src/', async () => {
    const findings = await scanClientTree(path.join(repoRoot, 'src'))
    expect(findings).toEqual([])
  })
})
