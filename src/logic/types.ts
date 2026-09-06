/** Where the user says they are. Only shapes copy and the readiness checklist; never inferred from anything they log. */
export type Situation = 'meds' | 'therapy' | 'both' | 'tapering' | 'numb';
export const SITUATIONS: [Situation, string, string][] = [
  ['meds', 'On antidepressants', 'and it is working, mostly, but something is missing'],
  ['therapy', 'In therapy', 'or looking for a therapist'],
  ['both', 'Both', 'medication and therapy'],
  ['tapering', 'Thinking about coming off', 'or already tapering with a prescriber'],
  ['numb', 'Neither, just dimmed', 'not sure what to call it'],
];

/** What feels dimmed. The community's own words for emotional blunting. */
export type Dim = 'joy' | 'wanting' | 'desire' | 'tears' | 'caring' | 'ambition' | 'appetite' | 'closeness';
export const DIMS: [Dim, string][] = [
  ['joy', 'Joy'],
  ['wanting', 'Wanting anything'],
  ['desire', 'Desire'],
  ['tears', 'Crying'],
  ['caring', 'Caring'],
  ['ambition', 'Ambition'],
  ['appetite', 'Appetite'],
  ['closeness', 'Feeling close to people'],
];

/** What used to light them up. Seeds the Sparks library. */
export type SparkKind = 'make' | 'move' | 'faith' | 'people' | 'nature' | 'music' | 'animals' | 'build' | 'serve' | 'learn';
export const SPARK_KINDS: [SparkKind, string, string][] = [
  ['make', 'Making things', '🎨'],
  ['move', 'Moving my body', '🏃'],
  ['faith', 'Faith or meaning', '🕯'],
  ['people', 'People', '☕'],
  ['nature', 'Being outside', '🌿'],
  ['music', 'Music', '🎧'],
  ['animals', 'Animals', '🐕'],
  ['build', 'Building or fixing', '🔧'],
  ['serve', 'Helping someone', '🤝'],
  ['learn', 'Learning', '📚'],
];

/** The five evidence pillars. See research/brief.md. */
export type Pillar = 'move' | 'light' | 'people' | 'purpose' | 'clean';
export const PILLARS: { id: Pillar; label: string; emoji: string; hint: string }[] = [
  { id: 'move', label: 'Moved', emoji: '🚶', hint: 'A walk counts. Ten minutes counts.' },
  { id: 'light', label: 'Daylight', emoji: '☀️', hint: 'Outside before noon, even for a minute.' },
  { id: 'people', label: 'A person', emoji: '💬', hint: 'One message, one call, one hello.' },
  { id: 'purpose', label: 'On purpose', emoji: '🧭', hint: 'Something for what you are for.' },
  { id: 'clean', label: 'Clean inputs', emoji: '🚿', hint: 'A day without the thing you named.' },
];

export type Size = 'tiny' | 'small' | 'normal';
export const SIZES: [Size, string, string][] = [
  ['tiny', 'Tiny', '2 minutes. Stand up, open a window.'],
  ['small', 'Small', '10 minutes. Round the block.'],
  ['normal', 'Normal', '30 minutes or more.'],
];

/** One day's record. Keyed by local YYYY-MM-DD. */
export type Day = {
  date: string;
  /** 1–5. Undefined until the check-in is done. */
  mood?: number;
  energy?: number;
  /** "How much did you feel today?" 1 = nothing got through, 5 = all of it. The un-dimming signal. */
  feel?: number;
  pillars: Pillar[];
  oneThing?: string;
  oneThingSize?: Size;
  oneThingDone: boolean;
  note?: string;
};

/** PHQ-9, public domain (Pfizer). Item 9 is the self-harm item and gates the crisis card. */
export type Phq = { date: string; answers: number[]; total: number };

export type AppState = {
  onboarded: boolean;
  name: string;
  situation: Situation;
  dims: Dim[];
  sparks: SparkKind[];
  /** One line: what they are for. Optional; shown on Today when set. */
  why: string;
  /** The thing "clean inputs" means for them, in their words. Never shown anywhere but Today. */
  cleanFrom: string;
  supportPerson: string;
  /** They have told their prescriber they want to talk about tapering one day. Part of readiness. */
  prescriberTalk: boolean;
  days: Record<string, Day>;
  phq: Phq[];
  customActs: { id: string; text: string; kind: SparkKind }[];
  reminders: { enabled: boolean; hour: number };
  /** ISO of the last time the crisis card was shown, so it is not shown twice in a day. */
  crisisAt: string | null;
  createdAt: string;
};

export const DEFAULT_STATE: AppState = {
  onboarded: false,
  name: '',
  situation: 'numb',
  dims: [],
  sparks: [],
  why: '',
  cleanFrom: '',
  supportPerson: '',
  prescriberTalk: false,
  days: {},
  phq: [],
  customActs: [],
  reminders: { enabled: false, hour: 9 },
  crisisAt: null,
  createdAt: '',
};

export const FREE_HISTORY_DAYS = 7;

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Local calendar date as YYYY-MM-DD. */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function keyOffset(days: number, from: Date = new Date()): string {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
  return dateKey(d);
}

export function emptyDay(date: string): Day {
  return { date, pillars: [], oneThingDone: false };
}
