import type { ConversationMessage, DailySummaryEntry, WeeklySummaryEntry, SummaryCollection } from '../types/conversation';

export type SummaryType = 'daily' | 'weekly';

export function summarizeMessages(messages: ConversationMessage[], type: SummaryType): string {
  if (messages.length === 0) {
    return 'No messages to summarize.';
  }

  const counts = countByRole(messages);
  const range = buildDateRange(messages);
  const highlights = messages.slice(-5).map((message) => `- ${message.role}: ${message.content}`).join('\n');

  const heading = type === 'weekly' ? 'Weekly Summary' : 'Daily Summary';

  return [
    `${heading} for ${range}.`,
    `Total messages: ${messages.length} (user: ${counts.user}, assistant: ${counts.assistant}).`,
    'Recent highlights:',
    highlights
  ].join('\n');
}

export function buildDailyEntry(date: string, messages: ConversationMessage[]): DailySummaryEntry {
  return {
    date,
    summary: summarizeMessages(messages, 'daily'),
    messageCount: messages.length,
    createdAt: new Date().toISOString()
  };
}

export function buildWeeklyEntry(weekStart: string, weekEnd: string, messages: ConversationMessage[]): WeeklySummaryEntry {
  return {
    weekStart,
    weekEnd,
    summary: summarizeMessages(messages, 'weekly'),
    messageCount: messages.length,
    createdAt: new Date().toISOString()
  };
}

export function updateSummaryCollection<T extends DailySummaryEntry | WeeklySummaryEntry>(
  collection: SummaryCollection<T>,
  entry: T
): SummaryCollection<T> {
  const entries = [...collection.entries, entry];
  const trimmedEntries = entries.length > 7 ? entries.slice(-7) : entries;
  const archived = entries.length > 7 ? entries.slice(0, -7) : [];

  const rollingSummary = archived.length > 0
    ? [collection.rollingSummary, ...archived.map((item) => item.summary)].filter(Boolean).join('\n\n')
    : collection.rollingSummary;

  return {
    entries: trimmedEntries,
    rollingSummary,
    updatedAt: new Date().toISOString()
  };
}

export function filterMessagesByDateRange(messages: ConversationMessage[], start: Date, end: Date): ConversationMessage[] {
  return messages.filter((message) => {
    const createdAt = Date.parse(message.createdAt);
    if (Number.isNaN(createdAt)) {
      return false;
    }
    return createdAt >= start.getTime() && createdAt <= end.getTime();
  });
}

function countByRole(messages: ConversationMessage[]): { user: number; assistant: number } {
  return messages.reduce(
    (counts, message) => {
      if (message.role === 'user') {
        counts.user += 1;
      } else {
        counts.assistant += 1;
      }
      return counts;
    },
    { user: 0, assistant: 0 }
  );
}

function buildDateRange(messages: ConversationMessage[]): string {
  const timestamps = messages
    .map((message) => Date.parse(message.createdAt))
    .filter((value) => !Number.isNaN(value));

  if (timestamps.length === 0) {
    return 'unknown date range';
  }

  const start = new Date(Math.min(...timestamps));
  const end = new Date(Math.max(...timestamps));
  return `${start.toLocaleDateString('tr-TR')} - ${end.toLocaleDateString('tr-TR')}`;
}
