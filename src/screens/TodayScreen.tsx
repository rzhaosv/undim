import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Linking } from 'react-native';
import { Screen, Card, Label, Chip, PrimaryButton, SecondaryButton, Tag } from '../components/UI';
import { Flame } from '../components/Flame';
import { colors, radius, type } from '../theme';
import { useApp } from '../store/AppContext';
import { TabProps } from '../navigation';
import { PILLARS, SIZES, Size, Pillar } from '../logic/types';
import { suggestions } from '../content/sparks';
import { glow, flameStage, STAGE_NAMES, lastDays, checkedIn } from '../logic/readiness';
import { phqRisk } from '../content/phq';

const SCALE = [1, 2, 3, 4, 5];
const LABELS: Record<'mood' | 'energy' | 'feel', [string, string, string]> = {
  mood: ['Mood', 'low', 'good'],
  energy: ['Energy', 'flat', 'up'],
  feel: ['How much got through', 'nothing', 'all of it'],
};

export function CrisisCard() {
  return (
    <Card style={{ borderColor: colors.danger, backgroundColor: colors.dangerSoft, marginTop: 14 }}>
      <Text style={[type.h3, { color: colors.danger }]}>If it is dark right now</Text>
      <Text style={[type.bodySoft, { marginTop: 6 }]}>Undim is not a crisis service. In the US, call or text 988. Elsewhere, findahelpline.com. If you are in immediate danger, call your local emergency number.</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <SecondaryButton title="Call 988" small onPress={() => Linking.openURL('tel:988')} />
        <SecondaryButton title="findahelpline.com" small onPress={() => Linking.openURL('https://findahelpline.com')} />
      </View>
    </Card>
  );
}

export default function TodayScreen({ navigation }: TabProps<'Today'>) {
  const { state, today, todayKey, togglePillar, setOneThing, setDone, checkIn } = useApp();
  const [custom, setCustom] = useState('');
  const [size, setSize] = useState<Size>('small');
  const [draft, setDraft] = useState<{ mood?: number; energy?: number; feel?: number }>({});

  const g = glow(state);
  const stage = flameStage(g);
  const picks = useMemo(() => suggestions(state, todayKey, 4), [state.sparks, state.customActs, todayKey]);
  const week = lastDays(state, 7);
  const latestPhq = state.phq[state.phq.length - 1];
  const showCrisis = !!latestPhq && phqRisk(latestPhq.answers) && daysBetween(latestPhq.date, todayKey) <= 7;
  const phqDue = !latestPhq || daysBetween(latestPhq.date, todayKey) >= 7;
  const done = checkedIn(today);
  const v = (k: 'mood' | 'energy' | 'feel') => (done ? (today[k] as number) : draft[k]);
  const canSave = draft.mood !== undefined && draft.energy !== undefined && draft.feel !== undefined;

  const d = new Date();
  const dateLabel = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 6 }}>
        <View>
          <Text style={type.caption}>{dateLabel}</Text>
          <Text style={type.h1}>{state.name ? `${state.name}, today` : 'Today'}</Text>
        </View>
        <Tag text={STAGE_NAMES[stage]} tone={stage >= 3 ? 'gold' : 'plain'} />
      </View>

      <View style={{ alignItems: 'center', marginTop: 4 }}>
        <Flame stage={stage} size={170} />
        {state.why ? <Text style={[type.bodySoft, { textAlign: 'center', fontStyle: 'italic', marginTop: -6, paddingHorizontal: 10 }]}>{state.why}</Text> : null}
      </View>

      {showCrisis && <CrisisCard />}

      <Card style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Label style={{ marginBottom: 0 }}>One thing</Label>
          {today.oneThing ? <Tag text={SIZES.find((s) => s[0] === today.oneThingSize)?.[1] ?? 'Small'} /> : null}
        </View>
        {today.oneThing ? (
          <>
            <Text style={[type.h2, { marginTop: 10 }, today.oneThingDone && { textDecorationLine: 'line-through', color: colors.inkSoft }]}>{today.oneThing}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <PrimaryButton title={today.oneThingDone ? 'Done. That was the job.' : 'Did it'} onPress={() => setDone(!today.oneThingDone)} color={today.oneThingDone ? colors.success : undefined} textColor={today.oneThingDone ? '#fff' : undefined} style={{ flex: 1 }} small />
              {!today.oneThingDone && <SecondaryButton title="Swap" small onPress={() => setOneThing('', size) as unknown as void} />}
            </View>
          </>
        ) : (
          <>
            <Text style={[type.bodySoft, { marginTop: 6 }]}>Act first; the feeling follows, or it does not and you did it anyway. Pick one, any size.</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              {SIZES.map(([id, label]) => (
                <Chip key={id} text={label} selected={size === id} onPress={() => setSize(id)} />
              ))}
            </View>
            <Text style={[type.caption, { marginTop: 6 }]}>{SIZES.find((s) => s[0] === size)?.[2]}</Text>
            <View style={{ gap: 8, marginTop: 12 }}>
              {picks.map((a) => (
                <Pressable key={a.id} onPress={() => setOneThing(a.text, size)} style={({ pressed }) => [styles.pick, pressed && { opacity: 0.7 }]}>
                  <Text style={{ fontSize: 18 }}>{PILLARS.find((p) => p.id === a.pillar)?.emoji}</Text>
                  <Text style={[type.body, { flex: 1 }]}>{a.text}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'center' }}>
              <TextInput value={custom} onChangeText={setCustom} placeholder="Or write your own" placeholderTextColor={colors.inkFaint} style={styles.input} returnKeyType="done" onSubmitEditing={() => custom.trim() && setOneThing(custom.trim(), size)} />
              <SecondaryButton title="Set" small disabled={!custom.trim()} onPress={() => setOneThing(custom.trim(), size)} />
            </View>
          </>
        )}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Label>Check-in</Label>
        {(['mood', 'energy', 'feel'] as const).map((k) => (
          <View key={k} style={{ marginTop: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={type.h3}>{LABELS[k][0]}</Text>
              {k === 'feel' && <Text style={type.caption}>the un-dimming signal</Text>}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              {SCALE.map((n) => {
                const sel = v(k) === n;
                return (
                  <Pressable key={n} disabled={done} onPress={() => setDraft({ ...draft, [k]: n })} style={[styles.dot, sel && styles.dotActive, done && !sel && { opacity: 0.35 }]}>
                    <Text style={[type.numSm, sel && { color: colors.onAccent }]}>{n}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={type.caption}>{LABELS[k][1]}</Text>
              <Text style={type.caption}>{LABELS[k][2]}</Text>
            </View>
          </View>
        ))}
        {!done ? (
          <PrimaryButton title="Save today" onPress={() => canSave && checkIn(draft as { mood: number; energy: number; feel: number })} disabled={!canSave} style={{ marginTop: 14 }} small />
        ) : (
          <Text style={[type.sub, { marginTop: 12 }]}>Saved. Tomorrow is a new line.</Text>
        )}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Label>Pillars</Label>
        <Text style={[type.bodySoft, { marginTop: 2 }]}>Tap what happened today. Any size counts.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {PILLARS.map((p) => (
            <Chip key={p.id} text={`${p.emoji} ${p.id === 'clean' && state.cleanFrom ? `Without ${state.cleanFrom}` : p.label}`} big selected={today.pillars.includes(p.id)} onPress={() => togglePillar(p.id)} />
          ))}
        </View>
        <Text style={[type.caption, { marginTop: 10 }]}>{hint(today.pillars)}</Text>
      </Card>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 6 }}>
        <Text style={type.caption}>THIS WEEK</Text>
        <Pressable onPress={() => navigation.navigate('Phq')}>
          <Text style={[type.sub, { color: colors.accentDeep }]}>{phqDue ? 'Weekly check due ›' : 'Weekly check ›'}</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {week.map((dd) => {
          const on = checkedIn(dd) || dd.oneThingDone || dd.pillars.length > 0;
          return (
            <View key={dd.date} style={[styles.dayCell, on && { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}>
              <Text style={type.caption}>{new Date(dd.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'narrow' })}</Text>
              <Text style={{ fontSize: 14, marginTop: 2 }}>{dd.oneThingDone ? '🔥' : checkedIn(dd) ? '·' : ' '}</Text>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

function hint(p: Pillar[]): string {
  if (p.length === 0) return 'Nothing yet. Daylight is the easiest one.';
  if (p.length >= 4) return 'That is a whole day. Well done.';
  const missing = PILLARS.find((x) => !p.includes(x.id));
  return missing ? missing.hint : '';
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) / 86_400_000);
}

const styles = StyleSheet.create({
  pick: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.cardAlt, borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.line },
  input: { flex: 1, backgroundColor: colors.bgElevated, borderRadius: radius.md, borderWidth: 1, borderColor: colors.lineStrong, paddingHorizontal: 14, paddingVertical: 10, color: colors.ink, fontSize: 15, fontWeight: '500' },
  dot: { flex: 1, height: 42, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.lineStrong, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  dotActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayCell: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
});
