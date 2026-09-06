/** PHQ-9 (Kroenke, Spitzer & Williams). Public domain; developed with a grant from Pfizer. */
export const PHQ_PROMPT = 'Over the last two weeks, how often have you been bothered by any of the following problems?';

export const PHQ_ITEMS: string[] = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself, or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed; or the opposite, being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];

export const PHQ_OPTIONS: [number, string][] = [
  [0, 'Not at all'],
  [1, 'Several days'],
  [2, 'More than half the days'],
  [3, 'Nearly every day'],
];

export function phqTotal(answers: number[]): number {
  return answers.reduce((a, b) => a + (b || 0), 0);
}

export function phqSeverity(total: number): string {
  if (total <= 4) return 'Minimal';
  if (total <= 9) return 'Mild';
  if (total <= 14) return 'Moderate';
  if (total <= 19) return 'Moderately severe';
  return 'Severe';
}

/** Item 9 above zero is the signal for the crisis card, regardless of total. */
export function phqRisk(answers: number[]): boolean {
  return (answers[8] ?? 0) > 0;
}
