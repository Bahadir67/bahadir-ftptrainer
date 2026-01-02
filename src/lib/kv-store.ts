import { kv } from '@vercel/kv';
import type { Program } from '../types/program';
import type {
  ConversationMessage,
  DashboardData,
  DailySummaryEntry,
  WeeklySummaryEntry,
  SummaryCollection
} from '../types/conversation';

const PROGRAM_KEY = 'program:current';
const STRAVA_TOKENS_KEY = 'strava:tokens';

const CONVERSATION_MESSAGES_KEY = 'conversation:messages';
const CONVERSATION_DAILY_SUMMARY_KEY = 'conversation:summary:daily';
const CONVERSATION_WEEKLY_SUMMARY_KEY = 'conversation:summary:weekly';
const CONVERSATION_MEMORY_KEY = 'conversation:memory';
const CONVERSATION_DASHBOARD_KEY = 'conversation:dashboard';
const HEALTH_DAILY_PREFIX = 'health:daily:';
const HEALTH_DAILY_LATEST_KEY = 'health:daily:latest';

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

const HEALTH_METRICS = [
  'steps',
  'calories',
  'nutritionCalories',
  'distance',
  'restingHr',
  'avgHr',
  'maxHr',
  'hrv',
  'sleepHours',
  'sleepAvgHr',
  'weight',
  'bodyFat',
  'vo2Max',
  'spo2',
  'exerciseDuration',
  'avgSpeed',
  'avgPower',
  'energyScore',
  'bodyBattery'
] as const;

export type HealthMetricKey = (typeof HEALTH_METRICS)[number];
export type DailyHealthMetrics = Partial<Record<HealthMetricKey, number | null>>;

export type DailyHealth = {
  date: string;
  timeOfDay: 'morning' | 'afternoon';
  metrics: DailyHealthMetrics;
  source?: string;
  createdAt: string;
};

export async function getProgram(): Promise<Program | null> {
  return kv.get<Program>(PROGRAM_KEY);
}

export async function setProgram(program: Program): Promise<void> {
  await kv.set(PROGRAM_KEY, program);
}

export async function getStravaTokens(): Promise<StravaTokens | null> {
  return kv.get<StravaTokens>(STRAVA_TOKENS_KEY);
}

export async function setStravaTokens(tokens: StravaTokens): Promise<void> {
  await kv.set(STRAVA_TOKENS_KEY, tokens);
}

export async function getConversationMessages(): Promise<ConversationMessage[]> {
  return (await kv.get<ConversationMessage[]>(CONVERSATION_MESSAGES_KEY)) ?? [];
}

export async function setConversationMessages(messages: ConversationMessage[]): Promise<void> {
  await kv.set(CONVERSATION_MESSAGES_KEY, messages);
}

export async function appendConversationMessage(message: ConversationMessage): Promise<ConversationMessage[]> {
  const messages = await getConversationMessages();
  const nextMessages = [...messages, message];
  await setConversationMessages(nextMessages);
  return nextMessages;
}

export async function getConversationDashboard(): Promise<DashboardData | null> {
  return kv.get<DashboardData>(CONVERSATION_DASHBOARD_KEY);
}

export async function setConversationDashboard(dashboard: DashboardData): Promise<void> {
  await kv.set(CONVERSATION_DASHBOARD_KEY, dashboard);
}

export async function getConversationMemory(): Promise<string | null> {
  return kv.get<string>(CONVERSATION_MEMORY_KEY);
}

export async function setConversationMemory(memory: string): Promise<void> {
  await kv.set(CONVERSATION_MEMORY_KEY, memory);
}

export async function setDailyHealth(entry: DailyHealth): Promise<void> {
  await kv.set(`${HEALTH_DAILY_PREFIX}${entry.date}`, entry);
  await kv.set(HEALTH_DAILY_LATEST_KEY, entry);
}

export async function getDailyHealth(date: string): Promise<DailyHealth | null> {
  return kv.get<DailyHealth>(`${HEALTH_DAILY_PREFIX}${date}`);
}

export async function getLatestDailyHealth(): Promise<DailyHealth | null> {
  return kv.get<DailyHealth>(HEALTH_DAILY_LATEST_KEY);
}

export async function getDailySummaryCollection(): Promise<SummaryCollection<DailySummaryEntry>> {
  return (
    (await kv.get<SummaryCollection<DailySummaryEntry>>(CONVERSATION_DAILY_SUMMARY_KEY)) ?? {
      entries: [],
      updatedAt: new Date().toISOString()
    }
  );
}

export async function setDailySummaryCollection(collection: SummaryCollection<DailySummaryEntry>): Promise<void> {
  await kv.set(CONVERSATION_DAILY_SUMMARY_KEY, collection);
}

export async function getWeeklySummaryCollection(): Promise<SummaryCollection<WeeklySummaryEntry>> {
  return (
    (await kv.get<SummaryCollection<WeeklySummaryEntry>>(CONVERSATION_WEEKLY_SUMMARY_KEY)) ?? {
      entries: [],
      updatedAt: new Date().toISOString()
    }
  );
}

export async function setWeeklySummaryCollection(collection: SummaryCollection<WeeklySummaryEntry>): Promise<void> {
  await kv.set(CONVERSATION_WEEKLY_SUMMARY_KEY, collection);
}

export type ConversationContext = {
  memory: string | null;
  weeklySummary?: string;
  dailySummary?: string;
  recentMessages: ConversationMessage[];
  contextText: string;
};

export async function buildConversationContext(): Promise<ConversationContext> {
  const [memory, dailySummary, weeklySummary, messages] = await Promise.all([
    getConversationMemory(),
    getDailySummaryCollection(),
    getWeeklySummaryCollection(),
    getConversationMessages()
  ]);

  const latestDaily = dailySummary.entries.at(-1)?.summary;
  const latestWeekly = weeklySummary.entries.at(-1)?.summary;
  const recentMessages = getRecentMessages(messages, 2);

  const sections: string[] = [];
  if (memory) {
    sections.push(`Memory Notes:\n${memory}`);
  }
  if (latestWeekly) {
    sections.push(`Weekly Summary:\n${latestWeekly}`);
  }
  if (latestDaily) {
    sections.push(`Daily Summary:\n${latestDaily}`);
  }
  if (recentMessages.length > 0) {
    sections.push(`Recent Messages:\n${recentMessages.map(formatMessageLine).join('\n')}`);
  }

  return {
    memory,
    weeklySummary: latestWeekly,
    dailySummary: latestDaily,
    recentMessages,
    contextText: sections.join('\n\n')
  };
}

function getRecentMessages(messages: ConversationMessage[], days: number): ConversationMessage[] {
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  const recent = messages.filter((message) => {
    const createdAt = Date.parse(message.createdAt);
    if (Number.isNaN(createdAt)) {
      return true;
    }
    return createdAt >= cutoff;
  });

  if (recent.length > 0) {
    return recent;
  }

  return messages.slice(-20);
}

function formatMessageLine(message: ConversationMessage): string {
  const createdAt = Date.parse(message.createdAt);
  const label = Number.isNaN(createdAt)
    ? message.timestamp
    : new Date(createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });

  return `[${label}] ${message.role}: ${message.content}`;
}
