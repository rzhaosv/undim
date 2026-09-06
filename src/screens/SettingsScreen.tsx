import React, { useState } from 'react';
import { View, Text, Linking, TextInput, Alert, Modal, Share, Platform } from 'react-native';
import { Screen, Header, PrimaryButton, Card, Chip, Row, Group, SectionCaption, ToggleRow, sheetStyles, SecondaryButton } from '../components/UI';
import { colors, type } from '../theme';
import { useApp } from '../store/AppContext';
import { restore } from '../services/billing';
import { formatHour } from '../services/notifications';
import { TabProps } from '../navigation';
import { SITE } from './PaywallScreen';
import { SITUATIONS, SPARK_KINDS, SparkKind, Situation } from '../logic/types';
import { reportText } from '../logic/readiness';

export const SUPPORT_EMAIL = 'tryformaapp@gmail.com';
const HOURS = [7, 8, 9, 10, 12, 17, 18, 19, 20, 21];

type Sheet = null | 'name' | 'why' | 'support' | 'clean' | 'situation' | 'sparks' | 'hour' | 'about';

export default function SettingsScreen({ navigation }: TabProps<'Settings'>) {
  const { state, isPro, update, setReminders, resetAll } = useApp();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [text, setText] = useState('');
  const [sparks, setSparks] = useState<SparkKind[]>(state.sparks);

  const open = (s: Sheet, initial = '') => {
    setText(initial);
    setSparks(state.sparks);
    setSheet(s);
  };
  const close = () => setSheet(null);

  const onDelete = () =>
    Alert.alert('Delete everything?', 'Every check-in, PHQ-9 and setting is removed from this phone. Nothing is kept anywhere else, so nothing can be recovered.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => resetAll() },
    ]);

  const onReminders = async (v: boolean) => {
    if (!isPro) return navigation.navigate('Paywall', { reason: 'reminders' });
    const ok = await setReminders(v);
    if (v && !ok) Alert.alert('Notifications are off', 'Allow notifications for Undim in iOS Settings to get a reminder.');
  };

  const onExport = async () => {
    const t = reportText(state) + '\n\n' + JSON.stringify(state.days);
    if (Platform.OS === 'web') return Alert.alert('Export', t.slice(0, 2000));
    await Share.share({ message: t, title: 'Undim export' }).catch(() => {});
  };

  const onRestore = async () => {
    try {
      const ok = await restore();
      Alert.alert(ok ? 'Restored' : 'Nothing to restore', ok ? 'Undim Pro is active.' : 'No active subscription was found for this Apple ID.');
    } catch {
      Alert.alert('Restore failed', 'Please try again in a moment.');
    }
  };

  const save = () => {
    if (sheet === 'name') update({ name: text.trim() });
    if (sheet === 'why') update({ why: text.trim() });
    if (sheet === 'support') update({ supportPerson: text.trim() });
    if (sheet === 'clean') update({ cleanFrom: text.trim() });
    if (sheet === 'sparks') update({ sparks });
    close();
  };

  return (
    <Screen scroll>
      <Header big title="Settings" />

      <Card style={{ marginTop: 4 }}>
        <Text style={type.label}>Plan</Text>
        <Text style={[type.h2, { marginTop: 6 }]}>{isPro ? 'Undim Pro' : 'Free'}</Text>
        {!isPro && (
          <>
            <Text style={[type.sub, { marginTop: 4 }]}>Today, the flame, the pillars, the PHQ-9 and Learn are free forever. Pro adds the prescriber report, twelve-week trends, reminders and your own sparks.</Text>
            <PrimaryButton title="Unlock Pro" onPress={() => navigation.navigate('Paywall')} style={{ marginTop: 14, height: 46 }} />
          </>
        )}
      </Card>

      <SectionCaption>YOU</SectionCaption>
      <Group>
        <Row label="Name" value={state.name} onPress={() => open('name', state.name)} />
        <Row label="Where you are" value={SITUATIONS.find((s) => s[0] === state.situation)?.[1]} onPress={() => open('situation')} />
        <Row label="What you are for" value={state.why ? state.why.slice(0, 18) + (state.why.length > 18 ? '…' : '') : 'Not set'} onPress={() => open('why', state.why)} />
        <Row label="Sparks" value={`${state.sparks.length}`} onPress={() => open('sparks')} />
        <Row label="Clean pillar word" value={state.cleanFrom || 'Not set'} onPress={() => open('clean', state.cleanFrom)} last />
      </Group>

      <SectionCaption>SCAFFOLDING</SectionCaption>
      <Group>
        <Row label="Someone in your corner" value={state.supportPerson || 'Not set'} onPress={() => open('support', state.supportPerson)} />
        <ToggleRow label="Prescriber knows" sub="You have told them you want to talk about tapering one day" value={state.prescriberTalk} onChange={(v) => update({ prescriberTalk: v })} last />
      </Group>

      <SectionCaption>REMINDERS</SectionCaption>
      <Group>
        <ToggleRow label="Daily reminder" sub={isPro ? 'One line, on your phone, nothing sent anywhere' : 'Part of Pro'} value={state.reminders.enabled} onChange={onReminders} />
        <Row label="At" value={formatHour(state.reminders.hour)} onPress={() => (isPro ? open('hour') : navigation.navigate('Paywall', { reason: 'reminders' }))} last />
      </Group>

      <SectionCaption>DATA</SectionCaption>
      <Group>
        <Row label="Export everything" onPress={onExport} />
        <Row label="Restore purchases" onPress={onRestore} />
        <Row label="Delete all data" danger onPress={onDelete} last />
      </Group>

      <SectionCaption>ABOUT</SectionCaption>
      <Group>
        <Row label="How Undim works, and what it is not" onPress={() => open('about')} />
        <Row label="Privacy policy" onPress={() => Linking.openURL(`${SITE}/privacy.html`)} />
        <Row label="Terms of use" onPress={() => Linking.openURL(`${SITE}/terms.html`)} />
        <Row label="Support" value={SUPPORT_EMAIL} onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Undim%20support`)} last />
      </Group>
      <Text style={[type.caption, { marginTop: 16, lineHeight: 17 }]}>Undim 1.0 · Everything stays on this phone. No account, no server, no analytics.</Text>

      <Modal visible={sheet !== null} transparent animationType="slide" onRequestClose={close}>
        <View style={{ flex: 1 }}>
          <View style={sheetStyles.backdrop} onTouchEnd={close} />
          <View style={sheetStyles.sheet}>
            {(sheet === 'name' || sheet === 'why' || sheet === 'support' || sheet === 'clean') && (
              <>
                <Text style={type.h2}>{sheet === 'name' ? 'Your name' : sheet === 'why' ? 'What are you for?' : sheet === 'support' ? 'Who is in your corner?' : 'The Clean pillar word'}</Text>
                {sheet === 'clean' && <Text style={[type.sub, { marginTop: 6 }]}>Stays on your phone. Never in the report or the export.</Text>}
                <TextInput value={text} onChangeText={setText} style={sheetStyles.input} autoFocus multiline={sheet === 'why'} placeholderTextColor={colors.inkFaint} placeholder={sheet === 'why' ? 'One line' : ''} />
                <PrimaryButton title="Save" onPress={save} style={{ marginTop: 16 }} />
              </>
            )}
            {sheet === 'situation' && (
              <>
                <Text style={type.h2}>Where you are</Text>
                <View style={{ gap: 8, marginTop: 14 }}>
                  {SITUATIONS.map(([id, label]) => (
                    <Chip key={id} text={label} big selected={state.situation === id} onPress={() => { update({ situation: id as Situation }); close(); }} />
                  ))}
                </View>
              </>
            )}
            {sheet === 'sparks' && (
              <>
                <Text style={type.h2}>Sparks</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                  {SPARK_KINDS.map(([id, label, emoji]) => (
                    <Chip key={id} text={`${emoji} ${label}`} selected={sparks.includes(id)} onPress={() => setSparks(sparks.includes(id) ? sparks.filter((x) => x !== id) : [...sparks, id])} />
                  ))}
                </View>
                <PrimaryButton title="Save" onPress={save} style={{ marginTop: 16 }} disabled={sparks.length === 0} />
              </>
            )}
            {sheet === 'hour' && (
              <>
                <Text style={type.h2}>Remind me at</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                  {HOURS.map((h) => (
                    <Chip key={h} text={formatHour(h)} selected={state.reminders.hour === h} onPress={async () => { await setReminders(state.reminders.enabled, h); close(); }} />
                  ))}
                </View>
              </>
            )}
            {sheet === 'about' && (
              <>
                <Text style={type.h2}>What Undim is</Text>
                <Text style={[type.body, { marginTop: 10 }]}>A behavioural-activation habit tool with a readiness score. One small act a day, five evidence-based pillars, a weekly PHQ-9 and a 28-day summary you can hand to your prescriber.</Text>
                <Text style={[type.h3, { marginTop: 14 }]}>What it is not</Text>
                <Text style={[type.body, { marginTop: 6 }]}>Medical advice, treatment, or a taper plan. Undim never suggests stopping, skipping or changing a dose. Only your prescriber does that, and never abruptly. If you are in crisis, call or text 988 in the US or find a line at findahelpline.com.</Text>
                <SecondaryButton title="Close" onPress={close} style={{ marginTop: 16 }} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
