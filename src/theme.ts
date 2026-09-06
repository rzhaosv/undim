import { Platform, TextStyle } from 'react-native';

/** Warm paper, deep ink, and a flame that goes from ember to amber as the user "undims". */
export const colors = {
  bg: '#FBF7F0',
  bgElevated: '#F3EDE2',
  card: '#FFFDF9',
  cardAlt: '#F4EEE3',
  ink: '#1C1A17',
  inkSoft: '#6B645B',
  inkFaint: '#9A9287',
  accent: '#E8A23B',
  accentDeep: '#B8761F',
  accentSoft: 'rgba(232,162,59,0.16)',
  glow: 'rgba(232,162,59,0.32)',
  ember: '#E4643B',
  emberSoft: 'rgba(228,100,59,0.12)',
  dim: '#6B7380',
  dimSoft: 'rgba(107,115,128,0.14)',
  line: 'rgba(28,26,23,0.08)',
  lineStrong: 'rgba(28,26,23,0.16)',
  success: '#5F8F6A',
  successSoft: 'rgba(95,143,106,0.14)',
  danger: '#B9463A',
  dangerSoft: 'rgba(185,70,58,0.12)',
  overlay: 'rgba(28,26,23,0.55)',
  onAccent: '#1C1A17',
  onInk: '#FBF7F0',
};

export const radius = { sm: 12, md: 16, lg: 20, xl: 28, pill: 999 };

export const space = (n: number) => n * 4;

/** System serif for headings; sans for everything else. */
export const serif = Platform.select({
  ios: 'Georgia',
  web: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
  default: 'serif',
}) as string;

const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

export const type: Record<string, TextStyle> = {
  display: { fontFamily: serif, fontSize: 34, fontWeight: '700', color: colors.ink, letterSpacing: -0.4, lineHeight: 40 },
  h1: { fontFamily: serif, fontSize: 27, fontWeight: '700', color: colors.ink, letterSpacing: -0.3, lineHeight: 33 },
  h2: { fontFamily: serif, fontSize: 21, fontWeight: '700', color: colors.ink, letterSpacing: -0.2, lineHeight: 27 },
  h3: { fontSize: 17, fontWeight: '700', color: colors.ink },
  body: { fontSize: 16, fontWeight: '400', color: colors.ink, lineHeight: 23 },
  bodySoft: { fontSize: 15, fontWeight: '400', color: colors.inkSoft, lineHeight: 22 },
  label: { fontSize: 12, fontWeight: '700', color: colors.accentDeep, letterSpacing: 1.4, textTransform: 'uppercase' },
  sub: { fontSize: 13, fontWeight: '500', color: colors.inkSoft },
  caption: { fontSize: 12, fontWeight: '500', color: colors.inkFaint },
  num: { fontSize: 30, fontWeight: '800', color: colors.ink, letterSpacing: -0.8, ...tabular },
  numSm: { fontSize: 15, fontWeight: '700', color: colors.ink, ...tabular },
  numLg: { fontSize: 44, fontWeight: '800', color: colors.ink, letterSpacing: -1.2, ...tabular },
  numXL: { fontSize: 64, fontWeight: '800', color: colors.ink, letterSpacing: -2.4, ...tabular },
};

/** react-native-web paints the "on" thumb teal by default; keep it white to match iOS. */
export const switchProps = Platform.OS === 'web' ? ({ activeThumbColor: '#fff' } as Record<string, unknown>) : {};
