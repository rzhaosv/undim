/**
 * One local reminder a day at the chosen hour (Pro). Scheduled on-device; nothing is sent anywhere.
 */
import { Platform } from 'react-native';

const DAYS_AHEAD = 14;

const LINES: string[] = [
  'One thing today. Tiny counts.',
  'The flame is still on. Feed it once.',
  'Stand outside for a minute, then decide.',
  'You do not have to feel like it. That is the whole trick.',
  'Send one person one message.',
  'Round the block and back. That is the entire job.',
  'Whatever size today allows.',
  'Act first. The feeling comes after, or it does not, and you did it anyway.',
  'Open the curtains. Then we will talk.',
  'Do the smallest version of the thing.',
  'Your one thing is waiting, and it is not judging you.',
  'Ten minutes on purpose.',
  'A person, a walk, or some daylight. Pick one.',
  'Still here. Still lit. One thing.',
];

type Notif = typeof import('expo-notifications');
let mod: Notif | null = null;
function lib(): Notif | null {
  if (Platform.OS === 'web') return null;
  if (!mod) {
    try {
      mod = require('expo-notifications') as Notif;
      mod.setNotificationHandler({
        handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
      });
    } catch {
      mod = null;
    }
  }
  return mod;
}

export async function requestPermission(): Promise<boolean> {
  const N = lib();
  if (!N) return false;
  const cur = await N.getPermissionsAsync();
  if (cur.granted) return true;
  const res = await N.requestPermissionsAsync();
  return !!res.granted;
}

export async function cancelReminders(): Promise<void> {
  const N = lib();
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync().catch(() => {});
}

/** Rebuilds the queue for the next DAYS_AHEAD days. Re-run on every app open while reminders are on. */
export async function scheduleReminders(hour: number, name: string): Promise<boolean> {
  const N = lib();
  if (!N) return false;
  const ok = await requestPermission();
  if (!ok) return false;
  await cancelReminders();
  if (Platform.OS === 'android') {
    await N.setNotificationChannelAsync('reminders', { name: 'Reminders', importance: N.AndroidImportance.DEFAULT }).catch(() => {});
  }
  const now = new Date();
  const offset = Math.floor(now.getTime() / 86_400_000) % LINES.length;
  for (let d = 0; d < DAYS_AHEAD; d++) {
    const when = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, hour, 0, 0, 0);
    if (when.getTime() <= now.getTime() + 60_000) continue;
    await N.scheduleNotificationAsync({
      content: { title: name ? `${name}, one thing` : 'One thing', body: LINES[(offset + d) % LINES.length], sound: false },
      trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: when },
    }).catch(() => {});
  }
  return true;
}

export function formatHour(h: number): string {
  const ampm = h >= 12 ? 'pm' : 'am';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:00 ${ampm}`;
}
