import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Screen, Header } from '../components/UI';
import { colors, radius, type } from '../theme';
import { TabProps } from '../navigation';
import { CARDS } from '../content/learn';

export default function LearnScreen({ navigation }: TabProps<'Learn'>) {
  return (
    <Screen scroll>
      <Header big title="Learn" />
      <Text style={[type.bodySoft, { marginTop: -2 }]}>Short, sourced, no hype. Enough to ask a better question at your next appointment.</Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {CARDS.map((c) => (
          <Pressable key={c.id} onPress={() => navigation.navigate('Card', { id: c.id })} style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }, c.id === 'crisis' && { borderColor: colors.danger }]}>
            <Text style={type.h2}>{c.title}</Text>
            <Text style={[type.bodySoft, { marginTop: 6 }]}>{c.summary}</Text>
            {c.source && <Text style={[type.caption, { marginTop: 8 }]}>{c.source.label}</Text>}
          </Pressable>
        ))}
      </View>
      <Text style={[type.caption, { marginTop: 18, lineHeight: 17 }]}>Undim is a self-care tool, not medical advice or treatment. Decisions about medication belong to you and your prescriber.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 18, borderWidth: 1, borderColor: colors.line },
});
