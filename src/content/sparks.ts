import { Pillar, Size, SparkKind, AppState } from '../logic/types';

export type Act = { id: string; kind: SparkKind; pillar: Pillar; size: Size; text: string };

/** Why each spark counts, in one breath. Shown on the Sparks tab. */
export const WHY: Record<SparkKind, string> = {
  make: 'Making something puts a finished thing in the world that was not there this morning. Depression runs on "nothing I do matters"; a mug on the table says otherwise.',
  move: 'In the SMILE trials, four months of aerobic exercise matched sertraline for remission, and people who kept moving relapsed less. It is the best-evidenced thing on this list.',
  faith: 'Every recovery account names something to be for. A candle, a psalm, a quiet room: five minutes of turning toward what is bigger than the day.',
  people: 'Isolation is the accelerant. One message to one person is the smallest unit of "I am still here", and it counts on the days you cannot talk.',
  nature: 'Daylight before noon is the most repeated piece of lay advice in every depression thread, and the circadian science backs it. Trees are a bonus.',
  music: 'Music gets in past the numbness when words cannot. A song you used to love is a test of whether feeling is coming back, and a way to invite it.',
  animals: 'A dog does not care how you feel today. Being needed by something warm is one of the most reliable levers there is.',
  build: 'Fixing one broken thing is behavioural activation in its purest form: a small task with a visible result and no one to impress.',
  serve: 'Being useful to another person is the fastest route out of your own head. It also answers the question "what am I for?" without having to think about it.',
  learn: 'Curiosity is wanting, in miniature. Ten minutes on a thing you are interested in is proof that interest is still in there.',
};

const A = (id: string, kind: SparkKind, pillar: Pillar, size: Size, text: string): Act => ({ id, kind, pillar, size, text });

export const ACTS: Act[] = [
  // move
  A('walk8', 'move', 'move', 'small', 'Walk for 8 minutes. Round the block and back.'),
  A('stairs', 'move', 'move', 'tiny', 'Go up and down the stairs twice.'),
  A('stretch', 'move', 'move', 'tiny', 'Stretch on the floor for two minutes.'),
  A('walk30', 'move', 'move', 'normal', 'Walk for 30 minutes without your phone out.'),
  A('gym', 'move', 'move', 'normal', 'Do one workout you used to do. Half of it counts.'),
  A('bike', 'move', 'move', 'normal', 'Ride a bike anywhere.'),
  // nature / light
  A('sun', 'nature', 'light', 'tiny', 'Stand outside in daylight for one minute before noon.'),
  A('coffeeout', 'nature', 'light', 'small', 'Drink your coffee outside.'),
  A('park', 'nature', 'light', 'normal', 'Sit in a park for twenty minutes. No task.'),
  A('window', 'nature', 'light', 'tiny', 'Open the curtains and the window as soon as you wake.'),
  // people
  A('text1', 'people', 'people', 'tiny', 'Send one person one message. "Thinking of you" is enough.'),
  A('call', 'people', 'people', 'small', 'Call someone for five minutes.'),
  A('coffee', 'people', 'people', 'normal', 'Sit with a person for an hour. Coffee, walk, anything.'),
  A('hello', 'people', 'people', 'tiny', 'Say hello to the person at the counter and mean it.'),
  A('support', 'people', 'people', 'small', 'Tell your support person one true sentence about today.'),
  // make
  A('cook', 'make', 'purpose', 'normal', 'Cook one meal from ingredients, not a packet.'),
  A('draw', 'make', 'purpose', 'small', 'Draw or write for ten minutes. Bad is fine.'),
  A('photo', 'make', 'purpose', 'tiny', 'Take one photo of something you find beautiful.'),
  A('song', 'music', 'purpose', 'tiny', 'Play the song you used to love, all the way through, doing nothing else.'),
  A('playlist', 'music', 'purpose', 'small', 'Make a playlist for the person you were.'),
  A('instrument', 'music', 'purpose', 'small', 'Pick up the instrument for ten minutes.'),
  // build
  A('fix', 'build', 'purpose', 'small', 'Fix one broken thing in the house.'),
  A('desk', 'build', 'purpose', 'small', 'Clear one surface completely.'),
  A('plant', 'build', 'purpose', 'tiny', 'Water the plant. Buy one if there is none.'),
  // serve
  A('help', 'serve', 'purpose', 'small', 'Do one thing for someone that they did not ask for.'),
  A('volunteer', 'serve', 'purpose', 'normal', 'Give an hour to something outside yourself: a shift, a neighbour, a lift.'),
  A('thank', 'serve', 'purpose', 'tiny', 'Thank one person, specifically, for one thing.'),
  // animals
  A('dogwalk', 'animals', 'move', 'small', 'Walk a dog. Yours, a neighbour’s, a shelter’s.'),
  A('petsit', 'animals', 'purpose', 'tiny', 'Sit with an animal for five minutes.'),
  // faith
  A('candle', 'faith', 'purpose', 'tiny', 'Light a candle and sit with it for three minutes.'),
  A('read', 'faith', 'purpose', 'small', 'Read one page of the book that used to steady you.'),
  A('quiet', 'faith', 'purpose', 'small', 'Ten minutes of quiet. No input. Just be somewhere.'),
  A('gather', 'faith', 'people', 'normal', 'Go where your people gather this week, even if you leave early.'),
  // learn
  A('learn10', 'learn', 'purpose', 'small', 'Spend ten minutes on the thing you are curious about.'),
  A('library', 'learn', 'light', 'normal', 'Go to a library or bookshop and come back with one thing.'),
  // clean inputs
  A('phonebed', 'learn', 'clean', 'tiny', 'Phone charges outside the bedroom tonight.'),
  A('noscroll', 'learn', 'clean', 'small', 'No feed until after your one thing is done.'),
  A('cleanday', 'learn', 'clean', 'normal', 'A whole day without the thing you named. Tell your support person.'),
];

/** Purpose acts for the week: one per week, bigger than a day's one thing. */
export const PURPOSE_ACTS: string[] = [
  'Make one thing with your hands and give it to someone.',
  'Show up somewhere you are expected, on time, for a month. Start this week.',
  'Find one person who is worse off than you this week and help them with something practical.',
  'Write down, in one paragraph, what you would do with your life if the numbness lifted. Keep it.',
  'Teach someone one thing you know.',
  'Take responsibility for one living thing: a plant, an animal, a garden bed.',
  'Repair one relationship by one message.',
  'Do the thing you have been avoiding for a month, badly, for twenty minutes.',
];

export function purposeActForWeek(createdAt: string): string {
  const start = createdAt ? new Date(createdAt).getTime() : Date.now();
  const week = Math.max(0, Math.floor((Date.now() - start) / (7 * 86_400_000)));
  return PURPOSE_ACTS[week % PURPOSE_ACTS.length];
}

/** Suggestions for today: prefer the user's sparks, mix pillars, rotate by date. */
export function suggestions(state: AppState, seed: string, n = 4): Act[] {
  const mine = ACTS.filter((a) => state.sparks.includes(a.kind));
  const pool = mine.length >= n ? mine : [...mine, ...ACTS.filter((a) => !state.sparks.includes(a.kind))];
  const custom: Act[] = state.customActs.map((c) => ({ id: c.id, kind: c.kind, pillar: 'purpose', size: 'small', text: c.text }));
  const all = [...custom, ...pool];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const out: Act[] = [];
  const seenPillar = new Set<Pillar>();
  for (let i = 0; i < all.length && out.length < n; i++) {
    const a = all[(h + i * 7) % all.length];
    if (out.includes(a)) continue;
    if (seenPillar.has(a.pillar) && out.length < 3) continue;
    out.push(a);
    seenPillar.add(a.pillar);
  }
  for (let i = 0; i < all.length && out.length < n; i++) {
    const a = all[(h + i * 3) % all.length];
    if (!out.includes(a)) out.push(a);
  }
  return out;
}
