import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Ellipse, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { colors } from '../theme';

/**
 * The flame. Stage 0 is a pilot light: a small blue-ish bead that never goes out.
 * Each stage adds height, warmth and a halo. Drawn in code so it scales anywhere.
 */
export function Flame({ stage, size = 160 }: { stage: number; size?: number }) {
  const s = Math.max(0, Math.min(5, stage));
  const h = [0.16, 0.3, 0.45, 0.6, 0.78, 0.95][s];
  const w = [0.12, 0.2, 0.3, 0.4, 0.5, 0.58][s];
  const outer = s === 0 ? '#7C8EA8' : s === 1 ? '#E4643B' : s === 2 ? '#E8823B' : colors.accent;
  const inner = s === 0 ? '#C9D6E8' : s <= 2 ? '#F5B26B' : '#FFE29A';
  const halo = [0, 0.08, 0.16, 0.24, 0.32, 0.42][s];
  const cx = 50;
  const base = 88;
  const top = base - h * 78;
  const hw = w * 42;
  const flame = `M ${cx} ${top} C ${cx + hw * 0.55} ${top + (base - top) * 0.28}, ${cx + hw} ${top + (base - top) * 0.62}, ${cx + hw * 0.62} ${base - 6} Q ${cx} ${base + 8} ${cx - hw * 0.62} ${base - 6} C ${cx - hw} ${top + (base - top) * 0.62}, ${cx - hw * 0.55} ${top + (base - top) * 0.28}, ${cx} ${top} Z`;
  const it = top + (base - top) * 0.42;
  const ihw = hw * 0.5;
  const innerP = `M ${cx} ${it} C ${cx + ihw * 0.6} ${it + (base - it) * 0.3}, ${cx + ihw} ${it + (base - it) * 0.65}, ${cx + ihw * 0.6} ${base - 8} Q ${cx} ${base + 2} ${cx - ihw * 0.6} ${base - 8} C ${cx - ihw} ${it + (base - it) * 0.65}, ${cx - ihw * 0.6} ${it + (base - it) * 0.3}, ${cx} ${it} Z`;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="halo" cx="50%" cy="70%" r="50%">
            <Stop offset="0%" stopColor={outer} stopOpacity={halo} />
            <Stop offset="100%" stopColor={outer} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        {halo > 0 && <Circle cx={50} cy={64} r={48} fill="url(#halo)" />}
        <Ellipse cx={50} cy={91} rx={16 + w * 20} ry={3.5} fill={colors.ink} opacity={0.12} />
        {s === 0 ? (
          <>
            <Ellipse cx={50} cy={84} rx={4.2} ry={6} fill={outer} />
            <Ellipse cx={50} cy={85.5} rx={2} ry={3.2} fill={inner} />
          </>
        ) : (
          <>
            <Path d={flame} fill={outer} />
            <Path d={innerP} fill={inner} opacity={0.95} />
          </>
        )}
        <Path d="M 36 90 Q 50 96 64 90" stroke={colors.ink} strokeOpacity={0.35} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </Svg>
    </View>
  );
}
