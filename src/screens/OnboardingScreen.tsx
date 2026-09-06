import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, type } from '../theme';
import { PrimaryButton, GhostButton, Chip, ProgressDots, OptionButton } from '../components/UI';
import { Flame } from '../components/Flame';
import { useApp } from '../store/AppContext';
import { Situation, SITUATIONS, Dim, DIMS, SparkKind, SPARK_KINDS } from '../logic/types';
import { demo } from '../dev/demo';

const STEPS = 6;

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const { completeOnboarding } = useApp();
  const seeded = demo?.onboardStep !== undefined;
  const [step, setStep] = useState(demo?.onboardStep ?? 0);
  const [situation, setSituation] = useState<Situation | null>(seeded ? 'meds' : null);
  const [dims, setDims] = useState<Dim[]>(seeded ? ['joy', 'wanting', 'tears'] : []);
  const [sparks, setSparks] = useState<SparkKind[]>(seeded ? ['move', 'music', 'people'] : []);
  const [name, setName] = useState(seeded ? 'Sam' : '');
  const [why, setWhy] = useState('');
  const [cleanFrom, setCleanFrom] = useState('');
  const [supportPerson, setSupportPerson] = useState('');

  const toggle = <T,>(list: T[], set: (v: T[]) => void, v: T) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const canContinue = step === 1 ? situation !== null : step === 3 ? sparks.length > 0 : step === 4 ? name.trim().length > 0 : true;

  const finish = () => {
    completeOnboarding({ name: name.trim(), situation: situation ?? 'numb', dims, sparks, why: why.trim(), cleanFrom: cleanFrom.trim(), supportPerson: supportPerson.trim() });
    onDone();
  };
  const next = () => (step < STEPS - 1 ? setStep(step + 1) : finish());
  const back = () => step > 0 && setStep(step - 1);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <ProgressDots count={STEPS} index={step} />
      </View>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Flame stage={0} size={150} />
            </View>
            <Text style={[type.label, { textAlign: 'center' }]}>Undim</Text>
            <Text style={[styles.q, { textAlign: 'center' }]}>The pilot light is still on.</Text>
            <Text style={[type.bodySoft, { marginTop: 10, textAlign: 'center' }]}>
              Medication that works can also turn the volume down on everything. Undim is for the part that comes next: one small thing a day, the five things the evidence says rebuild a life, and a record you can bring to the person who writes the script.
            </Text>
            <Text style={[type.caption, { marginTop: 18, textAlign: 'center', lineHeight: 17 }]}>
              Undim never tells you to stop or change a dose. Only your prescriber does that, and never abruptly.
            </Text>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={type.label}>Where are you</Text>
            <Text style={styles.q}>Right now, which is closest?</Text>
            <Text style={[type.bodySoft, { marginTop: 6 }]}>This only shapes the wording. Nothing is inferred from anything you log.</Text>
            <View style={{ gap: 10, marginTop: 18 }}>
              {SITUATIONS.map(([id, label, sub]) => (
                <OptionButton key={id} label={label} sub={sub} selected={situation === id} onPress={() => setSituation(id)} />
              ))}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={type.label}>What is dimmed</Text>
            <Text style={styles.q}>What has gone quiet?</Text>
            <Text style={[type.bodySoft, { marginTop: 6 }]}>Nearly half of people on antidepressants report this. It has a name: emotional blunting. Pick any, or none.</Text>
            <View style={styles.chips}>
              {DIMS.map(([id, label]) => (
                <Chip key={id} text={label} big selected={dims.includes(id)} onPress={() => toggle(dims, setDims, id)} />
              ))}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={type.label}>Sparks</Text>
            <Text style={styles.q}>What used to light you up?</Text>
            <Text style={[type.bodySoft, { marginTop: 6 }]}>Before, or ever. Your one-thing suggestions come from these.</Text>
            <View style={styles.chips}>
              {SPARK_KINDS.map(([id, label, emoji]) => (
                <Chip key={id} text={`${emoji} ${label}`} big selected={sparks.includes(id)} onPress={() => toggle(sparks, setSparks, id)} />
              ))}
            </View>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={type.label}>You</Text>
            <Text style={styles.q}>What should we call you?</Text>
            <TextInput value={name} onChangeText={setName} placeholder="First name" placeholderTextColor={colors.inkFaint} style={styles.input} autoFocus={!demo} returnKeyType="done" />
            <Text style={[type.h3, { marginTop: 26 }]}>One line: what are you for?</Text>
            <Text style={[type.sub, { marginTop: 4 }]}>Optional. It sits at the top of Today. Rewrite it any time.</Text>
            <TextInput value={why} onChangeText={setWhy} placeholder="For my daughter. For the music. To be useful." placeholderTextColor={colors.inkFaint} style={[styles.input, { fontSize: 16, fontWeight: '500' }]} multiline />
          </>
        )}

        {step === 5 && (
          <>
            <Text style={type.label}>Scaffolding</Text>
            <Text style={styles.q}>Two things the readiness score will ask about.</Text>
            <Text style={[type.h3, { marginTop: 22 }]}>Who is in your corner?</Text>
            <Text style={[type.sub, { marginTop: 4 }]}>One person who would want to know how this is going. Optional; you can add them later.</Text>
            <TextInput value={supportPerson} onChangeText={setSupportPerson} placeholder="A name" placeholderTextColor={colors.inkFaint} style={styles.input} />
            <Text style={[type.h3, { marginTop: 26 }]}>Where does the life force leak?</Text>
            <Text style={[type.sub, { marginTop: 4 }]}>
              The thing you reach for when nothing else gets through: the feed, porn, drink, 1am food. The Clean pillar is a day without it. This word stays on your phone and is never shown anywhere but Today.
            </Text>
            <TextInput value={cleanFrom} onChangeText={setCleanFrom} placeholder="Optional, in your words" placeholderTextColor={colors.inkFaint} style={styles.input} />
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        {step > 0 ? <GhostButton title="Back" onPress={back} /> : <View style={{ width: 60 }} />}
        <PrimaryButton title={step === 0 ? 'Begin' : step === STEPS - 1 ? 'Light it' : 'Continue'} onPress={next} disabled={!canContinue} style={{ flex: 1, marginLeft: 12 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  top: { paddingTop: 14, paddingBottom: 6 },
  body: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 30 },
  q: { ...type.h1, marginTop: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  input: {
    marginTop: 14,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '600',
  },
  footer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
});
