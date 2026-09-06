import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AppState as RNAppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, DEFAULT_STATE, Day, Dim, Situation, SparkKind, Pillar, Size, dateKey, emptyDay, uid } from '../logic/types';
import { phqTotal } from '../content/phq';
import { configureBilling, getCustomerInfo, isPremium, addPremiumListener } from '../services/billing';
import { scheduleReminders, cancelReminders } from '../services/notifications';
import { demo } from '../dev/demo';

export const STORAGE_KEY = 'undim.state.v1';
const DEV_UNLOCK = process.env.EXPO_PUBLIC_DEV_UNLOCK === '1' || process.env.EXPO_PUBLIC_DEV_UNLOCK === 'true';

export type Setup = {
  name: string;
  situation: Situation;
  dims: Dim[];
  sparks: SparkKind[];
  why: string;
  cleanFrom: string;
  supportPerson: string;
};

type Ctx = {
  ready: boolean;
  state: AppState;
  isPro: boolean;
  setPro: (v: boolean) => void;
  /** The key for "today", refreshed when the app comes to the foreground across midnight. */
  todayKey: string;
  today: Day;
  update: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
  completeOnboarding: (setup: Setup) => void;
  setDay: (key: string, patch: Partial<Day>) => void;
  togglePillar: (p: Pillar) => void;
  setOneThing: (text: string, size: Size) => void;
  setDone: (done: boolean) => void;
  checkIn: (v: { mood: number; energy: number; feel: number }) => void;
  addPhq: (answers: number[]) => void;
  addCustomAct: (text: string, kind: SparkKind) => void;
  removeCustomAct: (id: string) => void;
  setReminders: (enabled: boolean, hour?: number) => Promise<boolean>;
  resetAll: () => Promise<void>;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isPro, setIsPro] = useState(DEV_UNLOCK || !!demo?.pro);
  const [todayKey, setTodayKey] = useState(dateKey(demo?.now ?? new Date()));
  const stateRef = useRef(state);
  stateRef.current = state;

  // hydrate
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppState>;
          setState({ ...DEFAULT_STATE, ...parsed, reminders: { ...DEFAULT_STATE.reminders, ...(parsed.reminders ?? {}) } });
        }
      } catch {
        /* start fresh */
      }
      setReady(true);
    })();
  }, []);

  // persist
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  // billing
  useEffect(() => {
    if (demo) return;
    configureBilling();
    getCustomerInfo().then((info) => {
      if (info) setIsPro((p) => p || isPremium(info));
    });
    return addPremiumListener((pro) => setIsPro(DEV_UNLOCK || pro));
  }, []);

  // midnight rollover + reminder queue refresh
  useEffect(() => {
    const sub = RNAppState.addEventListener('change', (st) => {
      if (st !== 'active') return;
      const k = dateKey(demo?.now ?? new Date());
      setTodayKey((cur) => (cur === k ? cur : k));
      const s = stateRef.current;
      if (s.reminders.enabled && isPro) scheduleReminders(s.reminders.hour, s.name).catch(() => {});
    });
    return () => sub.remove();
  }, [isPro]);

  const update = useCallback<Ctx['update']>((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const setDay = useCallback<Ctx['setDay']>((key, patch) => {
    setState((s) => {
      const cur = s.days[key] ?? emptyDay(key);
      return { ...s, days: { ...s.days, [key]: { ...cur, ...patch, date: key } } };
    });
  }, []);

  const today = state.days[todayKey] ?? emptyDay(todayKey);

  const completeOnboarding = useCallback<Ctx['completeOnboarding']>(
    (setup) => {
      update({ ...setup, onboarded: true, createdAt: stateRef.current.createdAt || new Date().toISOString() });
    },
    [update],
  );

  const togglePillar = useCallback<Ctx['togglePillar']>(
    (p) => {
      const cur = stateRef.current.days[todayKey] ?? emptyDay(todayKey);
      const pillars = cur.pillars.includes(p) ? cur.pillars.filter((x) => x !== p) : [...cur.pillars, p];
      setDay(todayKey, { pillars });
    },
    [setDay, todayKey],
  );

  const setOneThing = useCallback<Ctx['setOneThing']>((text, size) => setDay(todayKey, { oneThing: text, oneThingSize: size, oneThingDone: false }), [setDay, todayKey]);
  const setDone = useCallback<Ctx['setDone']>((done) => setDay(todayKey, { oneThingDone: done }), [setDay, todayKey]);
  const checkIn = useCallback<Ctx['checkIn']>((v) => setDay(todayKey, v), [setDay, todayKey]);

  const addPhq = useCallback<Ctx['addPhq']>(
    (answers) => {
      const entry = { date: todayKey, answers, total: phqTotal(answers) };
      update((s) => ({ phq: [...s.phq.filter((p) => p.date !== todayKey), entry] }));
    },
    [update, todayKey],
  );

  const addCustomAct = useCallback<Ctx['addCustomAct']>((text, kind) => update((s) => ({ customActs: [...s.customActs, { id: uid(), text: text.trim(), kind }] })), [update]);
  const removeCustomAct = useCallback<Ctx['removeCustomAct']>((id) => update((s) => ({ customActs: s.customActs.filter((c) => c.id !== id) })), [update]);

  const setReminders = useCallback<Ctx['setReminders']>(
    async (enabled, hour) => {
      const h = hour ?? stateRef.current.reminders.hour;
      if (!enabled) {
        await cancelReminders();
        update({ reminders: { enabled: false, hour: h } });
        return true;
      }
      const ok = await scheduleReminders(h, stateRef.current.name);
      update({ reminders: { enabled: ok, hour: h } });
      return ok;
    },
    [update],
  );

  const resetAll = useCallback(async () => {
    await cancelReminders();
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    setState(DEFAULT_STATE);
  }, []);

  return (
    <AppCtx.Provider
      value={{
        ready,
        state,
        isPro,
        setPro: setIsPro,
        todayKey,
        today,
        update,
        completeOnboarding,
        setDay,
        togglePillar,
        setOneThing,
        setDone,
        checkIn,
        addPhq,
        addCustomAct,
        removeCustomAct,
        setReminders,
        resetAll,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside AppProvider');
  return c;
}
