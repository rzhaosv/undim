# Undim — research brief (Sep 6 2026)

Ask: an app for people on antidepressants, in therapy, or both. Find what actually gets people in these communities out, find a winning app to copy-and-improve, else build zero-to-one on the same principles. Get to a first App Store submission without asking for input.

## Framing constraint (stated up front)

The app never tells anyone to stop, skip or change a dose. Abrupt SSRI/SNRI discontinuation causes discontinuation syndrome and raises relapse risk; App Review (Guideline 1.4.1) and basic ethics both rule out an app that nudges people off medication. What the app CAN honestly do, and what nobody else does: build the life scaffolding that the evidence says makes a prescriber-supervised taper survivable, measure it, and hand the user a one-page "readiness" summary to take to the person who writes the script. That is the product.

## What the evidence says works (the pillars)

| Pillar | Evidence | How it shows up in the app |
|---|---|---|
| Behavioural activation (BA) — schedule one small value-linked activity a day, do it whether or not you feel like it | COBRA RCT (Lancet 2016, n=440): BA non-inferior to CBT for depression, at lower cost. BA is the simplest evidence-based psychotherapy for depression. | The "One thing" card is the whole home screen. Tiny / small / normal sizing. Done is done; "didn't" is just data. |
| Exercise | SMILE / SMILE-II (Blumenthal, Duke): 4 months of aerobic exercise ≈ sertraline for MDD remission; exercise during follow-up extended benefit and lowered relapse. Cochrane 2024 review: exercise ≈ therapy ≈ antidepressants (low-certainty). | "Move" pillar. Walk counts. |
| Morning light + regular sleep | Circadian regularity is the most-repeated lay advice in every depression thread ("go outside in the sun first thing"); sleep regularity predicts mood stability. | "Light" pillar: outside before noon, and a "slept on schedule" toggle. |
| Social contact | Isolation is the accelerant in every first-person recovery account; BA's activity lists always include a person. | "People" pillar: one contact, any size. |
| Purpose / values | ACT/BA both anchor activity in values; every recovery memoir names "something to be for". | Onboarding asks what used to light you up; "Sparks" library groups acts by that; a one-line "why". |
| Clean inputs | The community's own admission: porn, doomscrolling and drink are where numbed life force leaks. Framed as protecting attention/dopamine, not morality. | "Clean" pillar: a day without the thing you named. Never named on the store page. |
| MBCT with taper support | PREVENT trial (Kuyken, Lancet 2015): MBCT with support to taper was not inferior to maintenance antidepressants for relapse prevention over 24 months. | Cited on the Readiness screen as the reason scaffolding-first is the right order. |
| Hyperbolic tapering | Horowitz & Taylor (Lancet Psychiatry 2019): receptor occupancy is hyperbolic, so dose cuts must shrink as the dose falls; Outro Health (co-founded by Horowitz) built a telehealth clinic on it. | Learn card. Copy: "ask your prescriber about hyperbolic tapering". Never a schedule. |

Emotional blunting is the wedge: Goodwin et al. 2017 found 46% of people on antidepressant monotherapy report it. That is the "numbing your soul" complaint in the ask, in the words the community uses ("I don't cry, I don't want anything, I feel dimmed"). Hence the name.

## What the communities say (r/antidepressants, r/depression, r/getdisciplined, substack recovery posts)

- "Just one thing." Shower, brush teeth, 8-minute walk, sunlight. The bar for a good day is on the floor and that is the point.
- Streak-shaming makes it worse. Finch (4.9★, 737k ratings) wins because a missed day costs nothing.
- People who taper well have "a broad array of non-pharmacological tools already in place: exercise routine, sleep routine, eating, relationships" (Health Expectations 2024 qualitative study). Nobody builds those first; they stop and then scramble.
- The hard part of coming off is the return of feeling (blunting lifts) plus withdrawal being mistaken for relapse. Both need a prescriber who is watching, and a record.

## Competitors (iTunes search, Sep 6 2026)

- Finch: Self-Care Pet — 4.9★ / 736,848 ratings. Gamified self-care pet. Complaints: crowded menus, pop-up upsells, iOS vs Android price gap. Nothing about medication or readiness. This is the "winner" whose principle (gentle, forgiving, one tiny task) we keep.
- Daylio, Bearable, Moodfit, How We Feel — mood/symptom loggers. Bearable exports correlation reports for therapists (nearest thing to our report, but it is a general symptom tracker).
- Moodivate (Behavioral Activation Tech) — the one BA app: 3 ratings. Dead.
- Taper apps: DoseDown (0 ratings), Taper (27, 3.6★), TaperMate (5), TaperTracer (4). All dose-logging calculators for people already tapering. None builds the scaffolding, none is designed for someone still on a full dose who wants out one day.
- Outro Health — telehealth tapering clinic (Horowitz). Not an app competitor; a referral target in Learn.

Conclusion: no existing winner. Zero-to-one on Finch's gentleness + BA/exercise evidence + a taper-readiness report nobody has shipped.

## The product: Undim

"Feel again, on purpose."

- Onboarding: where are you (meds / therapy / both / thinking about tapering / just numb) → what's dimmed → what used to light you up → who's in your corner → reminder hour → paywall.
- Today: the flame (grows with 21-day activity, relapse-forgiving, never resets), One thing, 3-slider check-in (mood, energy, how much you felt), the five pillars as chips.
- Readiness: 0–100 from the last 28 days (mood stability, movement, light/sleep, people, purpose, support person, prescriber conversation, PHQ-9 < 10; PHQ-9 item 9 caps the score and shows the crisis card). Bands: Not yet / Building / Worth a conversation. Pro: shareable report.
- Sparks: acts by category with the why. Purpose act of the week.
- Learn: blunting, BA, exercise, light, discontinuation vs relapse, hyperbolic tapering, 988.
- Settings: reminders, support person, prescriber talk, export/delete, restore.
- Local-only. No account, no server. PHQ-9 is public domain.
- Pro: readiness report, PHQ-9 trend, 28/90-day trends, reminders, custom sparks. Monthly $9.99 / yearly $39.99, 7-day trials.

## Sources

- COBRA: https://pubmed.ncbi.nlm.nih.gov/27461440/ · https://www.nationalelfservice.net/treatment/cbt/behavioural-activation-not-inferior-to-cbt-for-depression-the-cobra-rct/
- SMILE-II: https://pubmed.ncbi.nlm.nih.gov/32790020/ · one-year follow-up https://www.researchgate.net/publication/49674661
- Cochrane exercise review: https://www.cochrane.org/zh-hans/about-us/news/exercise-treat-depression-yields-similar-results-therapy-and-antidepressants
- PREVENT (MBCT-TS): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4066271/
- Hyperbolic tapering: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10185864/ · https://www.outro.com/blog/stopping-antidepressants-what-is-hyperbolic-tapering
- Emotional blunting 46% (Goodwin 2017): https://pubmed.ncbi.nlm.nih.gov/37184083/ · https://www.healthline.com/health-news/common-antidepressants-can-cause-emotional-blunting-what-to-know
- Tapering lived experience (Health Expectations 2024): https://doaj.org/article/c63d6d977c52450b8a78dc1a0513f048
- Finch reviews: https://habitbox.app/blog/finch-app-review · https://snaptroid.co.uk/finch-app-review/
- Community: https://healthunlocked.com/anxiety-depression-support/posts/141116771/do-these-3-things-when-depressed · https://funkypsyche.substack.com/p/coping-with-showering-when-depressed · https://benalexander.substack.com/p/depression-how-i-beat-it
