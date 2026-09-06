import { AppState, Day, Pillar, keyOffset } from './types';
import { phqRisk } from '../content/phq';

export const WINDOW = 28;

/** Days for the last n calendar days, oldest first, empty days included. */
export function lastDays(state: AppState, n: number, from: Date = new Date()): Day[] {
  const out: Day[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const k = keyOffset(-i, from);
    out.push(state.days[k] ?? { date: k, pillars: [], oneThingDone: false });
  }
  return out;
}

export const checkedIn = (d: Day) => d.mood !== undefined;

/**
 * Glow 0..1: how alive the last 21 days are. Each day contributes if there was a check-in, a done thing, or a pillar,
 * with recent days weighted more. A missed day dims the flame a little; nothing ever resets.
 */
export function glow(state: AppState, from: Date = new Date()): number {
  const days = lastDays(state, 21, from);
  let num = 0;
  let den = 0;
  days.forEach((d, i) => {
    const w = 0.5 + (i / (days.length - 1)) * 0.5;
    const active = (checkedIn(d) ? 0.5 : 0) + (d.oneThingDone ? 0.35 : 0) + Math.min(0.3, d.pillars.length * 0.1);
    num += Math.min(1, active) * w;
    den += w;
  });
  return den ? num / den : 0;
}

/** 0 = pilot light, 5 = full flame. */
export function flameStage(g: number): number {
  if (g <= 0.02) return 0;
  if (g < 0.15) return 1;
  if (g < 0.32) return 2;
  if (g < 0.52) return 3;
  if (g < 0.75) return 4;
  return 5;
}

export const STAGE_NAMES = ['Pilot light', 'Ember', 'Catching', 'Steady', 'Bright', 'Undimmed'];

export type Part = { id: string; label: string; points: number; max: number; detail: string; ok: boolean };
export type Band = 'not yet' | 'building' | 'worth a conversation';
export type Readiness = { score: number; band: Band; parts: Part[]; capped: boolean; checkins: number };

const count = (days: Day[], p: Pillar) => days.filter((d) => d.pillars.includes(p)).length;

/**
 * A conversation-starter, not a decision. 28-day window. PHQ-9 item 9 above zero caps the score at 40 and
 * the crisis card is shown elsewhere; the app never recommends a dose change.
 */
export function readiness(state: AppState, from: Date = new Date()): Readiness {
  const days = lastDays(state, WINDOW, from);
  const done = days.filter(checkedIn);
  const parts: Part[] = [];

  // Mood stability: mean mood over the window and no very low day in the last 14.
  const moods = done.map((d) => d.mood as number);
  const mean = moods.length ? moods.reduce((a, b) => a + b, 0) / moods.length : 0;
  const recentLow = days.slice(-14).some((d) => checkedIn(d) && (d.mood as number) <= 1);
  let moodPts = 0;
  if (done.length >= 14) {
    moodPts = Math.round(Math.max(0, Math.min(1, (mean - 2) / 2)) * 20);
    if (!recentLow) moodPts += 5;
  } else moodPts = Math.round((done.length / 14) * 8);
  parts.push({
    id: 'mood',
    label: 'Mood steady',
    points: Math.min(25, moodPts),
    max: 25,
    detail: done.length >= 14 ? `Average ${mean.toFixed(1)} of 5 over ${done.length} check-ins${recentLow ? ', with a hard day in the last two weeks' : ''}` : `${done.length} of 14 check-ins so far`,
    ok: done.length >= 14 && mean >= 3 && !recentLow,
  });

  const move = count(days, 'move');
  parts.push({ id: 'move', label: 'Moving', points: Math.min(20, Math.round((move / 12) * 20)), max: 20, detail: `${move} days in 28 (aim 12)`, ok: move >= 12 });
  const light = count(days, 'light');
  parts.push({ id: 'light', label: 'Daylight & sleep', points: Math.min(15, Math.round((light / 14) * 15)), max: 15, detail: `${light} days in 28 (aim 14)`, ok: light >= 14 });
  const people = count(days, 'people');
  parts.push({ id: 'people', label: 'People', points: Math.min(15, Math.round((people / 8) * 15)), max: 15, detail: `${people} days in 28 (aim 8)`, ok: people >= 8 });
  const purpose = count(days, 'purpose');
  parts.push({ id: 'purpose', label: 'On purpose', points: Math.min(10, Math.round((purpose / 4) * 10)), max: 10, detail: `${purpose} days in 28 (aim 4)`, ok: purpose >= 4 });

  parts.push({ id: 'support', label: 'Someone in your corner', points: state.supportPerson.trim() ? 5 : 0, max: 5, detail: state.supportPerson.trim() ? state.supportPerson.trim() : 'Name one person in Settings', ok: !!state.supportPerson.trim() });
  parts.push({ id: 'prescriber', label: 'Prescriber knows', points: state.prescriberTalk ? 5 : 0, max: 5, detail: state.prescriberTalk ? 'You have raised it with them' : 'Tell them you want to talk about it one day', ok: state.prescriberTalk });

  const latest = state.phq[state.phq.length - 1];
  const phqOk = !!latest && latest.total < 10;
  parts.push({ id: 'phq', label: 'PHQ-9 under 10', points: phqOk ? 5 : 0, max: 5, detail: latest ? `Latest score ${latest.total}` : 'Take the weekly check', ok: phqOk });

  let score = parts.reduce((a, p) => a + p.points, 0);
  const capped = !!latest && phqRisk(latest.answers);
  if (capped) score = Math.min(score, 40);
  const band: Band = score >= 70 ? 'worth a conversation' : score >= 40 ? 'building' : 'not yet';
  return { score, band, parts, capped, checkins: done.length };
}

export function bandCopy(b: Band): string {
  if (b === 'worth a conversation') return 'Twenty-eight days of evidence that the scaffolding is up. Bring the report to your prescriber and ask what a slow, supervised taper could look like.';
  if (b === 'building') return 'Something is holding. Keep going; the score wants a month of it before it will say more.';
  return 'Nothing to prove yet. One thing today is the whole job.';
}

/** Plain-text summary for the share sheet. Never includes the clean-inputs word or notes. */
export function reportText(state: AppState, from: Date = new Date()): string {
  const r = readiness(state, from);
  const days = lastDays(state, WINDOW, from);
  const done = days.filter(checkedIn);
  const avg = (k: 'mood' | 'energy' | 'feel') => {
    const v = done.map((d) => d[k] as number).filter((x) => x !== undefined);
    return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : '–';
  };
  const lines: string[] = [];
  lines.push(`Undim — 28-day summary for ${state.name || 'me'}`);
  lines.push(`Prepared ${from.toDateString()}. This is a self-report to support a conversation with my prescriber. It is not a recommendation to change any medication.`);
  lines.push('');
  lines.push(`Check-ins: ${done.length} of 28 days`);
  lines.push(`Average mood ${avg('mood')} / 5 · energy ${avg('energy')} / 5 · how much I felt ${avg('feel')} / 5`);
  lines.push(`Days moved: ${count(days, 'move')} · daylight: ${count(days, 'light')} · a person: ${count(days, 'people')} · on purpose: ${count(days, 'purpose')}`);
  lines.push(`One thing done: ${days.filter((d) => d.oneThingDone).length} days`);
  if (state.phq.length) {
    lines.push('');
    lines.push('PHQ-9:');
    state.phq.slice(-6).forEach((p) => lines.push(`  ${p.date}: ${p.total}${phqRisk(p.answers) ? ' (item 9 above zero)' : ''}`));
  }
  lines.push('');
  lines.push(`Support person named: ${state.supportPerson.trim() ? 'yes' : 'no'} · prescriber aware I want to discuss tapering: ${state.prescriberTalk ? 'yes' : 'no'}`);
  lines.push(`Readiness score: ${r.score}/100 (${r.band})${r.capped ? ' — capped because of PHQ-9 item 9' : ''}`);
  lines.push('');
  lines.push('Questions I want to ask: Is a taper reasonable for me? What would a slow, hyperbolic taper look like? What should I watch for, and when do I call you?');
  return lines.join('\n');
}

/** Weekly averages for the trend chart: last n weeks, oldest first. */
export function weekly(state: AppState, weeks: number, key: 'mood' | 'energy' | 'feel', from: Date = new Date()): (number | null)[] {
  const days = lastDays(state, weeks * 7, from);
  const out: (number | null)[] = [];
  for (let w = 0; w < weeks; w++) {
    const chunk = days.slice(w * 7, w * 7 + 7).map((d) => d[key]).filter((x): x is number => x !== undefined);
    out.push(chunk.length ? chunk.reduce((a, b) => a + b, 0) / chunk.length : null);
  }
  return out;
}
