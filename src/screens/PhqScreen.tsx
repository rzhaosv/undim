import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Screen, Header, Card, PrimaryButton, Tag } from '../components/UI';
import { colors, radius, type } from '../theme';
import { useApp } from '../store/AppContext';
import { ScreenProps } from '../navigation';
import { PHQ_PROMPT, PHQ_ITEMS, PHQ_OPTIONS, phqTotal, phqSeverity, phqRisk } from '../content/phq';
import { CrisisCard } from './TodayScreen';
import { demo } from '../dev/demo';

export default function PhqScreen({ navigation }: ScreenProps<'Phq'>) {
  const { addPhq } = useApp();
  const [answers, setAnswers] = useState<(number | undefined)[]>(demo?.name === 'phq' ? [1, 1, 2, 1, 0, 1, 1, 0, undefined] : Array(9).fill(undefined));
  const [saved, setSaved] = useState(false);
  const complete = answers.every((a) => a !== undefined);
  const total = phqTotal(answers.map((a) => a ?? 0));
  const risk = phqRisk(answers.map((a) => a ?? 0));

  const save = () => {
    addPhq(answers.map((a) => a ?? 0));
    setSaved(true);
  };

  return (
    <Screen scroll>
      <Header title="PHQ-9" onBack={() => navigation.goBack()} />
      {!saved ? (
        <>
          <Text style={[type.h2, { marginTop: 8 }]}>{PHQ_PROMPT}</Text>
          <Text style={[type.caption, { marginTop: 6 }]}>Public domain (Kroenke, Spitzer, Williams). Answer honestly; nothing changes in the app except the record.</Text>
          {PHQ_ITEMS.map((item, i) => (
            <Card key={i} style={{ marginTop: 12 }}>
              <Text style={type.body}>
                <Text style={{ color: colors.inkFaint }}>{i + 1}. </Text>
                {item}
              </Text>
              <View style={{ gap: 6, marginTop: 10 }}>
                {PHQ_OPTIONS.map(([v, label]) => {
                  const sel = answers[i] === v;
                  return (
                    <Pressable key={v} onPress={() => setAnswers(answers.map((a, j) => (j === i ? v : a)))} style={[styles.opt, sel && styles.optActive]}>
                      <Text style={[type.sub, { color: sel ? colors.onAccent : colors.ink, fontWeight: sel ? '700' : '500' }]}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          ))}
          <PrimaryButton title="Save" onPress={save} disabled={!complete} style={{ marginTop: 20 }} />
        </>
      ) : (
        <>
          <Card style={{ marginTop: 12, alignItems: 'center' }}>
            <Text style={type.numXL}>{total}</Text>
            <Tag text={phqSeverity(total)} tone={total < 10 ? 'gold' : 'red'} />
            <Text style={[type.bodySoft, { textAlign: 'center', marginTop: 10 }]}>
              {total < 10 ? 'Under 10 counts toward readiness. Keep the scaffolding up.' : 'Above 10 is worth telling your prescriber or therapist about this week, in those words: "my PHQ-9 was ' + total + '".'}
            </Text>
          </Card>
          {risk && <CrisisCard />}
          <PrimaryButton title="Back" onPress={() => navigation.goBack()} style={{ marginTop: 20 }} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  opt: { borderRadius: radius.sm, borderWidth: 1, borderColor: colors.lineStrong, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: colors.bgElevated },
  optActive: { backgroundColor: colors.accent, borderColor: colors.accent },
});
