/**
 * Capture App Store screenshots from the Expo web build with Playwright at iPhone 6.7" scale (1290x2796),
 * then compose a caption band above each capture. Run:
 *   node store/shots.js            (expects expo web on http://localhost:8087 and playwright in $PW)
 * Output: store/screenshots/01.png … 06.png
 */
const path = require('path');
const fs = require('fs');
const PW = process.env.PW || path.join(process.env.HOME, '.claude/jobs/5f43ca6b/tmp/pw/node_modules/playwright');
const { chromium } = require(PW);
const BASE = process.env.BASE || 'http://localhost:8087';
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });

const SHOTS = [
  ['01', 'today', 'One small thing a day.\nThe flame keeps count, gently.'],
  ['02', 'readiness', 'A readiness score to bring\nto your prescriber.'],
  ['03', 'sparks', 'Small acts, sorted by what\nused to light you up.'],
  ['04', 'phq', 'The PHQ-9 every week.\nHonest, private, on your phone.'],
  ['05', 'learn', 'Short, sourced, no hype.'],
  ['06', 'onboard&step=2', 'Nearly half of people on\nantidepressants feel dimmed.'],
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  for (const [n, demo] of SHOTS) {
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?demo=${demo}&snap=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(OUT, `${n}.png`) });
    await page.close();
    console.log('captured', n, demo);
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'captions.json'), JSON.stringify(SHOTS.map(([n, , c]) => [n, c])));
})();
