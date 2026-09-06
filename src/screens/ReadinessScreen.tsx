import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Screen, Header, Card, Label, PrimaryButton, SecondaryButton, Tag, ProGate } from '../components/UI';
import { colors, radius, type } from '../theme';
import { useApp } from '../store/AppContext';
import { TabProps } from '../navigation';
import { readiness, bandCopy, weekly } from '../logic/readiness';
import { CrisisCard } from './TodayScreen';
import { phqSeverity } from '../content/phq';

function Ring({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const tone = score >= 70 ? colors.accent : score >= 40 ? colors.ember : colors.dim;
  return (
    <View style={{ width: 140, height: 140, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={140} height={140} viewBox="0 0 140 140">
        <Circle cx={70} cy={70} r={r} stroke={colors.lineStrong} strokeWidth={10} fill="none" />
        <Circle cx={70} cy={70} r={r} stroke={tone} strokeWidth={10} fill="none" strokeDasharray={`${c}`} strokeDashoffset={c * (1 - score / 100)} strokeLinecap="round" transform="rotate(-90 70 70)" />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={type.numLg}>{score}</Text>
        <Text style={type.caption}>of 100</Text>
      </View>
    </View>
  );
}

function Bars({ values, color }: { values: (number | null)[]; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 64 }}>
      {values.map((v, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: 64 }}>
          <View style={{ width: '100%', height: v ? Math.max(4, (v / 5) * 60) : 4, borderRadius: 4, backgroundColor: v ? color : colors.lineStrong }} />
        </View>
      ))}
    </View>
  );
}

export default function ReadinessScreen({ navigation }: TabProps<'Readiness'>) {
  const { state, isPro } = useApp();
  const r = readiness(state);
  const latest = state.phq[state.phq.length - 1];
  const bandLabel = r.band === 'worth a conversation' ? 'Worth a conversation' : r.band === 'building' ? 'Building' : 'Not yet';
  const mood12 = weekly(state, 12, 'mood');
  const feel12 = weekly(state, 12, 'feel');

  return (
    <Screen scroll>
      <Header big title="Readiness" />
      <Text style={[type.bodySoft, { marginTop: -2 }]}>A conversation starter for your prescriber, from your last 28 days. Not a decision, and never a dose.</Text>

      <Card style={{ marginTop: 16, alignItems: 'center' }}>
        <Ring score={r.score} />
        <Tag text={bandLabel} tone={r.band === 'worth a conversation' ? 'gold' : r.band === 'building' ? 'red' : 'plain'} />
        <Text style={[type.body, { textAlign: 'center', marginTop: 10 }]}>{bandCopy(r.band)}</Text>
        {r.capped && <Text style={[type.caption, { textAlign: 'center', marginTop: 8, color: colors.danger }]}>Capped at 40 because the last PHQ-9 answered question 9 above zero. Talk to someone today.</Text>}
        <Text style={[type.caption, { marginTop: 8 }]}>{r.checkins} of 28 days checked in</Text>
      </Card>

      {r.capped && <CrisisCard />}

      <Card style={{ marginTop: 12 }}>
        <Label>What it is made of</Label>
        {r.parts.map((p, i) => (
          <View key={p.id} style={[styles.row, i === r.parts.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={[styles.check, p.ok && { backgroundColor: colors.success, borderColor: colors.success }]}>{p.ok && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>✓</Text>}</View>
            <View style={{ flex: 1 }}>
              <Text style={type.h3}>{p.label}</Text>
              <Text style={type.caption}>{p.detail}</Text>
            </View>
            <Text style={type.numSm}>
              {p.points}/{p.max}
            </Text>
          </View>
        ))}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Label style={{ marginBottom: 0 }}>Weekly PHQ-9</Label>
          {latest && <Tag text={`${latest.total} · ${phqSeverity(latest.total)}`} tone={latest.total < 10 ? 'gold' : 'red'} />}
        </View>
        <Text style={[type.bodySoft, { marginTop: 8 }]}>The nine-question depression measure clinicians use. Public domain. Once a week is plenty.</Text>
        <SecondaryButton title={latest ? 'Take it again' : 'Take the PHQ-9'} onPress={() => navigation.navigate('Phq')} style={{ marginTop: 12 }} small />
      </Card>

      {isPro ? (
        <>
          <Card style={{ marginTop: 12 }}>
            <Label>Twelve weeks</Label>
            <Text style={[type.sub, { marginBottom: 8 }]}>Mood, weekly average</Text>
            <Bars values={mood12} color={colors.accent} />
            <Text style={[type.sub, { marginTop: 14, marginBottom: 8 }]}>How much got through</Text>
            <Bars values={feel12} color={colors.ember} />
            {state.phq.length > 1 && (
              <>
                <Text style={[type.sub, { marginTop: 14, marginBottom: 8 }]}>PHQ-9</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {state.phq.slice(-8).map((p) => (
                    <Tag key={p.date} text={`${p.date.slice(5)} · ${p.total}`} tone={p.total < 10 ? 'gold' : 'red'} />
                  ))}
                </View>
              </>
            )}
          </Card>
          <PrimaryButton title="Open the report for your prescriber" onPress={() => navigation.navigate('Report')} style={{ marginTop: 16 }} />
        </>
      ) : (
        <ProGate title="The report" body="A one-page summary of the last 28 days, worded for your prescriber, plus twelve-week trends. Share it as text or print it. Undim Pro." onPress={() => navigation.navigate('Paywall', { reason: 'report' })} />
      )}

      <Text style={[type.caption, { marginTop: 18, lineHeight: 17 }]}>
        Why this order: in the PREVENT trial, people who built skills first and then tapered with a clinician did as well over two years as people who stayed on medication. Scaffolding, then the taper, never the other way round. Details in Learn.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
});
