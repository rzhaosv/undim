import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PurchasesPackage } from 'react-native-purchases';
import { colors, radius, type } from '../theme';
import { PrimaryButton } from '../components/UI';
import { Flame } from '../components/Flame';
import { getPackages, purchase, restore, isCancelledError } from '../services/billing';
import { useApp } from '../store/AppContext';
import { ScreenProps } from '../navigation';

export const SITE = 'https://tryforma.app/undim';
const BENEFITS: [string, string][] = [
  ['The prescriber report', 'Your last 28 days, worded for the person who writes the script.'],
  ['Twelve-week trends', 'Mood, energy and how much got through, week by week. PHQ-9 over time.'],
  ['Daily reminder', 'One line at your hour, scheduled on your phone.'],
  ['Your own sparks', 'The acts only you would know to do, in your daily suggestions.'],
  ['Everything else stays free', 'Today, the flame, the pillars, the PHQ-9 and Learn. Always.'],
];
const REASON: Record<string, string> = {
  report: 'The report is part of Pro.',
  trends: 'Trends are part of Pro.',
  reminders: 'Reminders are part of Pro.',
  history: 'History past a week is part of Pro.',
  custom: 'Your own sparks are part of Pro.',
};

export default function PaywallScreen({ navigation, route }: ScreenProps<'Paywall'>) {
  const { setPro } = useApp();
  const [pkgs, setPkgs] = useState<PurchasesPackage[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fromOnboarding = route.params?.fromOnboarding;
  const reason = route.params?.reason;

  useEffect(() => {
    getPackages().then((p) => {
      setPkgs(p);
      const annual = p.find(isAnnual);
      setSelected((annual ?? p[0])?.identifier ?? null);
      setLoaded(true);
    });
  }, []);

  const close = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.replace('Tabs');
  };

  const unlocked = () => {
    setPro(true);
    close();
  };

  const onSubscribe = async () => {
    const pkg = pkgs.find((p) => p.identifier === selected);
    if (!pkg) {
      Alert.alert('Not available yet', 'Plans could not be loaded right now. Please check your connection and try again.');
      return;
    }
    setBusy(true);
    try {
      const ok = await purchase(pkg);
      if (ok) unlocked();
    } catch (e) {
      if (!isCancelledError(e)) Alert.alert('Purchase failed', 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const onRestore = async () => {
    setBusy(true);
    try {
      const ok = await restore();
      if (ok) unlocked();
      else Alert.alert('Nothing to restore', 'No active subscription was found for this Apple ID.');
    } catch {
      Alert.alert('Restore failed', 'Please try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  const ordered = [...pkgs].sort((a, b) => (isAnnual(a) ? -1 : isAnnual(b) ? 1 : 0));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Pressable onPress={close} hitSlop={12} style={styles.close}>
        <Text style={{ color: colors.inkSoft, fontSize: 16, fontWeight: '600' }}>{fromOnboarding ? 'Skip' : '✕'}</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center' }}>
          <Flame stage={5} size={120} />
        </View>
        <Text style={[type.display, { textAlign: 'center', marginTop: 4 }]}>Undim Pro</Text>
        <Text style={[type.bodySoft, { textAlign: 'center', marginTop: 6 }]}>{reason ? REASON[reason] : 'The report for your prescriber, and the trends behind it.'}</Text>

        <View style={styles.benefits}>
          {BENEFITS.map(([label, sub]) => (
            <View key={label} style={styles.benefitRow}>
              <View style={styles.dot} />
              <View style={{ flex: 1 }}>
                <Text style={type.h3}>{label}</Text>
                <Text style={type.sub}>{sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ gap: 12, marginTop: 4 }}>
          {!loaded ? (
            <Text style={[type.caption, { textAlign: 'center' }]}>Loading plans…</Text>
          ) : ordered.length === 0 ? (
            <View style={styles.plan}>
              <Text style={[type.bodySoft, { textAlign: 'center', flex: 1 }]}>Plans are not available right now. Everything free stays free; try again later.</Text>
            </View>
          ) : (
            ordered.map((p) => {
              const active = p.identifier === selected;
              const annual = isAnnual(p);
              return (
                <Pressable key={p.identifier} onPress={() => setSelected(p.identifier)} style={[styles.plan, active && styles.planActive]}>
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3}>{annual ? 'Yearly' : 'Monthly'}</Text>
                    <Text style={[type.caption, { color: annual ? colors.accentDeep : colors.inkSoft, marginTop: 2 }]}>
                      {annual ? '7-day free trial, then yearly · best value' : '7-day free trial, then monthly'}
                    </Text>
                  </View>
                  <Text style={[type.numSm, { fontSize: 17, color: active ? colors.ink : colors.inkSoft }]}>{p.product.priceString}</Text>
                </Pressable>
              );
            })
          )}
        </View>

        <PrimaryButton title="Start my 7-day free trial" onPress={onSubscribe} loading={busy} disabled={!selected} style={{ marginTop: 20 }} />
        <Pressable onPress={close} style={{ alignItems: 'center', paddingVertical: 14 }}>
          <Text style={[type.sub, { color: colors.inkSoft }]}>Continue with the free version</Text>
        </Pressable>
        <Text style={[type.caption, { textAlign: 'center', lineHeight: 17 }]}>
          Free for 7 days, then the plan price is charged to your Apple ID. Subscriptions auto-renew unless cancelled at least 24 hours before the
          end of the current period. Cancel anytime in Settings.
        </Text>

        <View style={styles.links}>
          <Pressable onPress={onRestore}><Text style={styles.link}>Restore purchases</Text></Pressable>
          <Pressable onPress={() => Linking.openURL(`${SITE}/terms.html`)}><Text style={styles.link}>Terms</Text></Pressable>
          <Pressable onPress={() => Linking.openURL(`${SITE}/privacy.html`)}><Text style={styles.link}>Privacy</Text></Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function isAnnual(p: PurchasesPackage) {
  return p.packageType === 'ANNUAL' || p.identifier === '$rc_annual';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  close: { position: 'absolute', top: 54, right: 20, zIndex: 5, padding: 6 },
  scroll: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 30 },
  benefits: { marginTop: 22, marginBottom: 20, gap: 14 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 7 },
  plan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 18,
    gap: 10,
  },
  planActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  links: { flexDirection: 'row', justifyContent: 'center', gap: 22, marginTop: 18 },
  link: { color: colors.inkSoft, fontSize: 13, fontWeight: '600' },
});
