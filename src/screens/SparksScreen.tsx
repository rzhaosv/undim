import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { Screen, Header, Card, Label, Chip, SecondaryButton, Tag, ProGate } from '../components/UI';
import { colors, radius, type } from '../theme';
import { useApp } from '../store/AppContext';
import { TabProps } from '../navigation';
import { SPARK_KINDS, SparkKind, PILLARS, SIZES } from '../logic/types';
import { ACTS, WHY, purposeActForWeek } from '../content/sparks';

export default function SparksScreen({ navigation }: TabProps<'Sparks'>) {
  const { state, isPro, setOneThing, addCustomAct, removeCustomAct, today } = useApp();
  const [kind, setKind] = useState<SparkKind>(state.sparks[0] ?? 'move');
  const [text, setText] = useState('');
  const kinds = [...state.sparks, ...SPARK_KINDS.map((k) => k[0]).filter((k) => !state.sparks.includes(k))];
  const acts = ACTS.filter((a) => a.kind === kind);
  const mine = state.customActs.filter((c) => c.kind === kind);
  const meta = SPARK_KINDS.find((k) => k[0] === kind)!;

  const pick = (t: string) => {
    if (today.oneThing && !today.oneThingDone) {
      Alert.alert('Swap today’s one thing?', `Replace "${today.oneThing}" with this.`, [
        { text: 'Keep', style: 'cancel' },
        { text: 'Swap', onPress: () => { setOneThing(t, 'small'); navigation.navigate('Today'); } },
      ]);
      return;
    }
    setOneThing(t, 'small');
    navigation.navigate('Today');
  };

  const add = () => {
    if (!text.trim()) return;
    if (!isPro) return navigation.navigate('Paywall', { reason: 'custom' });
    addCustomAct(text, kind);
    setText('');
  };

  return (
    <Screen scroll>
      <Header big title="Sparks" />
      <Text style={[type.bodySoft, { marginTop: -2 }]}>Small acts, sorted by what used to light you up. Tap one to make it today’s one thing.</Text>

      <Card style={{ marginTop: 16, backgroundColor: colors.ink, borderColor: colors.ink }}>
        <Label color={colors.accent}>This week, on purpose</Label>
        <Text style={[type.h2, { color: colors.onInk }]}>{purposeActForWeek(state.createdAt)}</Text>
        <Text style={[type.sub, { color: colors.inkFaint, marginTop: 8 }]}>Bigger than a day’s one thing. It changes every week. Log it under the On purpose pillar when it happens.</Text>
      </Card>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
        {kinds.map((k) => {
          const m = SPARK_KINDS.find((x) => x[0] === k)!;
          return <Chip key={k} text={`${m[2]} ${m[1]}`} selected={kind === k} onPress={() => setKind(k)} />;
        })}
      </View>

      <Card style={{ marginTop: 14 }}>
        <Label>Why {meta[1].toLowerCase()} counts</Label>
        <Text style={type.body}>{WHY[kind]}</Text>
      </Card>

      <View style={{ gap: 8, marginTop: 12 }}>
        {mine.map((c) => (
          <Pressable key={c.id} onPress={() => pick(c.text)} onLongPress={() => Alert.alert('Remove this spark?', c.text, [{ text: 'Keep', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: () => removeCustomAct(c.id) }])} style={({ pressed }) => [styles.act, pressed && { opacity: 0.7 }]}>
            <Tag text="Yours" tone="gold" />
            <Text style={[type.body, { flex: 1 }]}>{c.text}</Text>
          </Pressable>
        ))}
        {acts.map((a) => (
          <Pressable key={a.id} onPress={() => pick(a.text)} style={({ pressed }) => [styles.act, pressed && { opacity: 0.7 }]}>
            <Text style={{ fontSize: 18 }}>{PILLARS.find((p) => p.id === a.pillar)?.emoji}</Text>
            <Text style={[type.body, { flex: 1 }]}>{a.text}</Text>
            <Text style={type.caption}>{SIZES.find((s) => s[0] === a.size)?.[1]}</Text>
          </Pressable>
        ))}
      </View>

      {isPro ? (
        <Card style={{ marginTop: 14 }}>
          <Label>Add your own to {meta[1].toLowerCase()}</Label>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TextInput value={text} onChangeText={setText} placeholder="Something only you would know to do" placeholderTextColor={colors.inkFaint} style={styles.input} returnKeyType="done" onSubmitEditing={add} />
            <SecondaryButton title="Add" small disabled={!text.trim()} onPress={add} />
          </View>
        </Card>
      ) : (
        <ProGate title="Your own sparks" body="Add the acts only you would know to do, and they show up in your daily suggestions. Undim Pro." onPress={() => navigation.navigate('Paywall', { reason: 'custom' })} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  act: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.line },
  input: { flex: 1, backgroundColor: colors.bgElevated, borderRadius: radius.md, borderWidth: 1, borderColor: colors.lineStrong, paddingHorizontal: 14, paddingVertical: 10, color: colors.ink, fontSize: 15, fontWeight: '500' },
});
