import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { colors } from './src/theme';
import { AppProvider, useApp } from './src/store/AppContext';
import { RootStackParamList, TabParamList } from './src/navigation';
import OnboardingScreen from './src/screens/OnboardingScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import TodayScreen from './src/screens/TodayScreen';
import ReadinessScreen from './src/screens/ReadinessScreen';
import SparksScreen from './src/screens/SparksScreen';
import LearnScreen from './src/screens/LearnScreen';
import CardScreen from './src/screens/CardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PhqScreen from './src/screens/PhqScreen';
import ReportScreen from './src/screens/ReportScreen';
import { demo } from './src/dev/demo';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.card,
    text: colors.ink,
    primary: colors.accentDeep,
    border: colors.line,
  },
};

const TAB_ICONS: Record<keyof TabParamList, string> = { Today: '🔥', Readiness: '🧭', Sparks: '✨', Learn: '📖', Settings: '⚙' };

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName={demo?.tab ?? 'Today'}
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line, height: Platform.OS === 'web' ? 84 : undefined, paddingBottom: Platform.OS === 'web' ? 22 : undefined, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, focused }) => <Text style={{ fontSize: 18, color, opacity: focused ? 1 : 0.55 }}>{TAB_ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Readiness" component={ReadinessScreen} />
      <Tab.Screen name="Sparks" component={SparksScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function Root() {
  const { ready, state } = useApp();
  const [justOnboarded, setJustOnboarded] = useState(false);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  if (!state.onboarded) return <OnboardingScreen onDone={() => setJustOnboarded(true)} />;

  const initial: keyof RootStackParamList = demo?.screen ?? (justOnboarded ? 'Paywall' : 'Tabs');

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName={initial} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Phq" component={PhqScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="Card" component={CardScreen} />
        <Stack.Screen
          name="Paywall"
          component={PaywallScreen}
          options={{ presentation: 'modal' }}
          initialParams={justOnboarded ? { fromOnboarding: true } : undefined}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Web-only: pin the app to the viewport (phone-sized window when capturing screenshots)
// and pad for the iOS status bar / home indicator so captures match a real device.
const webFrame =
  Platform.OS === 'web'
    ? ({ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: colors.bg } as const)
    : null;
const demoInsets = demo ? { paddingTop: 59, paddingBottom: 34 } : null;

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppProvider>
        <View style={[{ flex: 1 }, webFrame as any, demoInsets]}>
          <Root />
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}
