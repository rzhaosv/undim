/**
 * Web-only demo seeding for App Store screenshots.
 *
 * With `?demo=<name>` in the URL on web, a canned AppState is written to localStorage under the
 * AsyncStorage key *before* AppContext hydrates, and `demo.screen` / `demo.tab` tell App.tsx what
 * to open. `demo.pro` unlocks Pro for every demo except `paywall` (`&pro=0` keeps it free).
 *
 * Guarded by `Platform.OS === 'web'`; on iOS/Android `demo` is always `null`.
 */
import { Platform } from 'react-native';
import { AppState, DEFAULT_STATE, Day, Pillar, dateKey } from '../logic/types';
import { RootStackParamList, TabParamList } from '../navigation';

const STORAGE_KEY = 'undim.state.v1';

export type DemoName = 'today' | 'readiness' | 'sparks' | 'learn' | 'settings' | 'paywall' | 'onboard' | 'report' | 'phq' | 'fresh';
const VALID: DemoName[] = ['today', 'readiness', 'sparks', 'learn', 'settings', 'paywall', 'onboard', 'report', 'phq', 'fresh'];

export type Demo = {
  name: DemoName;
  screen: keyof RootStackParamList | null;
  tab: keyof TabParamList;
  pro: boolean;
  snap: boolean;
  now?: Date;
  onboardStep?: number;
};

/** 28 believable days: a slow climb, a couple of bad days, pillars filling in over time. */
function seedDays(now: Date): Record<string, Day> {
  const days: Record<string, Day> = {};
  const things = [
    'Walk for 8 minutes. Round the block and back.',
    'Send one person one message.',
    'Drink your coffee outside.',
    'Fix one broken thing in the house.',
    'Play the song you used to love, all the way through.',
    'Call someone for five minutes.',
    'Clear one surface completely.',
  ];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const k = dateKey(d);
    const progress = (27 - i) / 27;
    const skip = i === 19 || i === 12 || i === 5;
    if (skip) continue;
    const bad = i === 16 || i === 9;
    const mood = bad ? 2 : Math.min(5, Math.max(2, Math.round(2.4 + progress * 1.9 + (i % 3 === 0 ? 0.4 : 0))));
    const energy = bad ? 2 : Math.min(5, Math.max(1, Math.round(2.2 + progress * 1.6 + (i % 4 === 0 ? 0.5 : 0))));
    const feel = bad ? 2 : Math.min(5, Math.max(1, Math.round(1.6 + progress * 2.4 + (i % 5 === 0 ? 0.5 : 0))));
    const pillars: Pillar[] = [];
    if (i % 2 === 0 || progress > 0.6) pillars.push('move');
    if (i % 2 === 1 || progress > 0.5) pillars.push('light');
    if (i % 3 === 0) pillars.push('people');
    if (i % 7 === 3 || i % 7 === 0) pillars.push('purpose');
    if (progress > 0.4 && i % 4 !== 1) pillars.push('clean');
    const isToday = i === 0;
    days[k] = {
      date: k,
      mood: isToday ? undefined : mood,
      energy: isToday ? undefined : energy,
      feel: isToday ? undefined : feel,
      pillars: isToday ? ['light'] : pillars,
      oneThing: things[i % things.length],
      oneThingSize: i % 3 === 0 ? 'tiny' : i % 3 === 1 ? 'small' : 'normal',
      oneThingDone: isToday ? false : !bad,
    };
  }
  return days;
}

function buildState(name: DemoName, now: Date, pro: boolean): AppState | null {
  if (name === 'onboard' || name === 'fresh') return null;
  const k = (d: number) => dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - d));
  return {
    ...DEFAULT_STATE,
    onboarded: true,
    name: 'Sam',
    situation: 'meds',
    dims: ['joy', 'wanting', 'tears'],
    sparks: ['move', 'music', 'people', 'build'],
    why: 'For my sister’s kids, and to make music again.',
    cleanFrom: 'the feed',
    supportPerson: 'Priya',
    prescriberTalk: true,
    days: seedDays(now),
    phq: [
      { date: k(21), answers: [2, 2, 1, 2, 1, 2, 1, 0, 0], total: 11 },
      { date: k(14), answers: [1, 2, 1, 1, 1, 1, 1, 0, 0], total: 8 },
      { date: k(7), answers: [1, 1, 1, 1, 0, 1, 1, 0, 0], total: 6 },
    ],
    customActs: [{ id: 'c1', text: 'Twenty minutes on the bass, badly.', kind: 'music' }],
    reminders: { enabled: pro, hour: 9 },
    crisisAt: null,
    createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 27).toISOString(),
  };
}

function read(): Demo | null {
  if (Platform.OS !== 'web') return null;
  if (typeof window === 'undefined' || !window.location || !window.localStorage) return null;
  const params = new URLSearchParams(window.location.search);
  const name = params.get('demo') as DemoName | null;
  if (!name || !VALID.includes(name)) return null;
  const pro = name !== 'paywall' && params.get('pro') !== '0';
  const now = new Date();
  const state = buildState(name, now, pro);
  try {
    if (state) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  const tab: keyof TabParamList =
    name === 'readiness' || name === 'report' || name === 'phq' ? 'Readiness' : name === 'sparks' ? 'Sparks' : name === 'learn' ? 'Learn' : name === 'settings' ? 'Settings' : 'Today';
  const onboarding = name === 'onboard' || name === 'fresh';
  const step = params.get('step');
  return {
    name,
    screen: name === 'paywall' ? 'Paywall' : name === 'report' ? 'Report' : name === 'phq' ? 'Phq' : onboarding ? null : 'Tabs',
    tab,
    pro,
    snap: params.get('snap') === '1',
    onboardStep: step ? Number(step) : undefined,
  };
}

/** Null everywhere except web with `?demo=`. Evaluated once at module load, before hydration. */
export const demo: Demo | null = read();

/** True when animations and timers should be frozen for a screenshot. */
export const snap = !!demo?.snap;
