export type Card = { id: string; title: string; summary: string; body: string[]; source?: { label: string; url: string } };

export const CARDS: Card[] = [
  {
    id: 'blunting',
    title: 'Why you feel dimmed',
    summary: 'Nearly half of people on antidepressants report emotional blunting. It has a name, and it is not you.',
    body: [
      'In a 2017 survey of 669 people being treated for depression, 46% reported emotional blunting: fewer highs, fewer lows, not crying at things that should make you cry, not wanting things you used to want.',
      'For many people this is a trade they would make again. For some it is the reason they want to come off one day. Both are legitimate. The point of Undim is to make sure the second group does it in the right order: scaffolding first, then a supervised taper.',
      'Blunting is different from depression itself, which can also flatten you. Your prescriber can help tell them apart; the "how much did you feel" slider on Today gives you a record to bring.',
    ],
    source: { label: 'Goodwin et al., 2017; scoping review 2023', url: 'https://pubmed.ncbi.nlm.nih.gov/37184083/' },
  },
  {
    id: 'ba',
    title: 'One thing a day is a treatment',
    summary: 'Behavioural activation, the simplest therapy for depression, is as effective as CBT.',
    body: [
      'Behavioural activation is the idea that you act first and the feeling follows, not the other way round. You schedule one small activity tied to something you value, and you do it whether or not you feel like it.',
      'In the COBRA trial (440 adults, published in The Lancet in 2016), behavioural activation delivered by junior mental-health workers was as effective as cognitive behavioural therapy from trained therapists, at lower cost.',
      'That is the whole of the Today screen. The size selector exists because the evidence is about doing the thing, not about how big it was.',
    ],
    source: { label: 'COBRA trial, The Lancet 2016', url: 'https://pubmed.ncbi.nlm.nih.gov/27461440/' },
  },
  {
    id: 'exercise',
    title: 'Movement matched sertraline',
    summary: 'In the SMILE trials, four months of aerobic exercise did what the antidepressant did.',
    body: [
      'Duke University’s SMILE studies randomised adults with major depression to supervised exercise, home exercise, sertraline, or a placebo pill. After four months, exercise and sertraline produced similar remission rates.',
      'At follow-up, people who kept exercising were less likely to have relapsed. A 2024 Cochrane review reached the same broad conclusion: exercise is comparable to therapy and to medication, with the caveat that the studies are small.',
      'The dose in the trials was roughly 35–40 minutes, three times a week. The Move pillar counts anything; the readiness score looks for about three days a week.',
    ],
    source: { label: 'Blumenthal et al., SMILE-II', url: 'https://pubmed.ncbi.nlm.nih.gov/32790020/' },
  },
  {
    id: 'light',
    title: 'Daylight before noon',
    summary: 'Regular sleep and morning light are the cheapest mood stabilisers there are.',
    body: [
      'Your body clock is set by light in the first hours after waking. Irregular sleep and dark mornings drag mood down on their own; a few minutes outside before noon nudges the whole day.',
      'This is the advice that comes up in every thread about getting out of a hole, because it works for people who cannot yet do anything harder: open the curtains, stand on the step, drink the coffee outside.',
      'The Daylight pillar is that. The readiness score looks for it about half the days.',
    ],
  },
  {
    id: 'withdrawal',
    title: 'Withdrawal is not relapse',
    summary: 'Stopping too fast causes symptoms that look like depression coming back. Knowing the difference matters.',
    body: [
      'Antidepressant discontinuation symptoms (dizziness, "brain zaps", nausea, irritability, vivid dreams, waves of low mood) typically start within days of a dose cut and can be mistaken for relapse, which usually returns more slowly and looks like the original episode.',
      'This is why nobody should stop abruptly and why the taper should be supervised by the person who prescribes. Your check-in history is useful here: a prescriber can see whether a dip lines up with a dose change.',
      'If you are already tapering and things feel wrong, the answer is to contact your prescriber, not to push through and not to stop.',
    ],
    source: { label: 'Antidepressant discontinuation syndrome (overview)', url: 'https://en.wikipedia.org/wiki/Antidepressant_discontinuation_syndrome' },
  },
  {
    id: 'hyperbolic',
    title: 'Ask about hyperbolic tapering',
    summary: 'The last milligrams are the hardest. There is a method for that, and your prescriber may not have heard of it.',
    body: [
      'Antidepressants occupy their target receptors on a curve, not a line: the first few milligrams do most of the work. Cutting the dose in equal steps therefore removes very little effect at the top and a great deal at the bottom, which is why the final steps of a taper are the ones that go wrong.',
      'Hyperbolic tapering (Horowitz and Taylor, 2019) shrinks each cut as the dose falls, often to fractions of a tablet using liquid formulations or tapering strips. Clinics such as Outro Health in the US are built on it.',
      'Undim does not make tapering schedules. It gives you a phrase to bring to your appointment: "Can we plan a hyperbolic taper?"',
    ],
    source: { label: 'Hyperbolic tapering outcomes, 2023', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10185864/' },
  },
  {
    id: 'mbct',
    title: 'Scaffolding first, then the taper',
    summary: 'In a 24-month trial, people who built skills and then tapered did as well as people who stayed on medication.',
    body: [
      'The PREVENT trial (424 people, The Lancet, 2015) compared staying on maintenance antidepressants against an eight-week mindfulness-based course with support to taper. Over two years, relapse rates were about the same.',
      'The order matters: the course came first and the taper came after, with a clinician in the loop. That is the order Undim is built around, and why the readiness score asks for 28 days of evidence before it will say "worth a conversation".',
    ],
    source: { label: 'PREVENT trial protocol', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4066271/' },
  },
  {
    id: 'inputs',
    title: 'Where the life force leaks',
    summary: 'Numbness looks for the fastest feeling available. That is usually a screen.',
    body: [
      'When wanting is dimmed, the things that still get through are the loud ones: feeds, porn, drink, food at 1am. None of them are moral failures; they are the path of least resistance for a nervous system that is starved of signal.',
      'The Clean pillar asks for one day at a time without the thing you named in onboarding. It is private: the word you chose is never shown anywhere but Today, and it is not in any export.',
      'Pairing it with the People pillar is the trick most people find. Tell one person. The day gets easier to hold.',
    ],
  },
  {
    id: 'crisis',
    title: 'If it gets dark',
    summary: 'Undim is not a crisis service. These are.',
    body: [
      'If you are thinking about ending your life, or are not safe right now: in the US, call or text 988 (Suicide & Crisis Lifeline). Elsewhere, findahelpline.com lists lines by country.',
      'If you are in immediate danger, call your local emergency number.',
      'The weekly PHQ-9 in Undim asks about this directly (question 9). Answering honestly is the point; the app shows these resources and nothing else changes.',
    ],
    source: { label: 'findahelpline.com', url: 'https://findahelpline.com' },
  },
];
