import React from 'react';
import { Text, Linking, Pressable } from 'react-native';
import { Screen, Header, Card } from '../components/UI';
import { colors, type } from '../theme';
import { ScreenProps } from '../navigation';
import { CARDS } from '../content/learn';
import { CrisisCard } from './TodayScreen';

export default function CardScreen({ navigation, route }: ScreenProps<'Card'>) {
  const c = CARDS.find((x) => x.id === route.params.id) ?? CARDS[0];
  return (
    <Screen scroll>
      <Header title="Learn" onBack={() => navigation.goBack()} />
      <Text style={[type.h1, { marginTop: 8 }]}>{c.title}</Text>
      <Text style={[type.bodySoft, { marginTop: 8, fontStyle: 'italic' }]}>{c.summary}</Text>
      {c.body.map((p, i) => (
        <Text key={i} style={[type.body, { marginTop: 14 }]}>{p}</Text>
      ))}
      {c.id === 'crisis' && <CrisisCard />}
      {c.source && (
        <Card style={{ marginTop: 20 }}>
          <Text style={type.caption}>SOURCE</Text>
          <Pressable onPress={() => Linking.openURL(c.source!.url)}>
            <Text style={[type.body, { color: colors.accentDeep, marginTop: 4 }]}>{c.source.label} ›</Text>
          </Pressable>
        </Card>
      )}
    </Screen>
  );
}
