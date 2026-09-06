import React, { useEffect } from 'react';
import { Text, Share, Platform, Alert } from 'react-native';
import { Screen, Header, Card, PrimaryButton } from '../components/UI';
import { colors, type } from '../theme';
import { useApp } from '../store/AppContext';
import { ScreenProps } from '../navigation';
import { reportText } from '../logic/readiness';

export default function ReportScreen({ navigation }: ScreenProps<'Report'>) {
  const { state, isPro } = useApp();
  useEffect(() => {
    if (!isPro) navigation.replace('Paywall', { reason: 'report' });
  }, [isPro]);
  const text = reportText(state);

  const share = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Report', text);
        return;
      }
      await Share.share({ message: text, title: 'Undim 28-day summary' });
    } catch {
      /* cancelled */
    }
  };

  return (
    <Screen scroll>
      <Header title="For your prescriber" onBack={() => navigation.goBack()} />
      <Text style={[type.bodySoft, { marginTop: 8 }]}>Plain text, worded so it can be read in thirty seconds before an appointment. It never includes your notes or the Clean word.</Text>
      <Card style={{ marginTop: 14 }}>
        <Text style={[type.body, { fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }), fontSize: 13, lineHeight: 19, color: colors.ink }]}>{text}</Text>
      </Card>
      <PrimaryButton title="Share or print" onPress={share} style={{ marginTop: 16 }} />
      <Text style={[type.caption, { marginTop: 14, lineHeight: 17 }]}>This summary is a self-report. It is not a recommendation to start, stop or change any medication. Those decisions belong to you and your prescriber.</Text>
    </Screen>
  );
}
