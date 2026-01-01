import { NextResponse } from 'next/server';
import {
  getConversationMessages,
  getDailySummaryCollection,
  getWeeklySummaryCollection,
  setDailySummaryCollection,
  setWeeklySummaryCollection
} from '../../../../lib/kv-store';
import {
  buildDailyEntry,
  buildWeeklyEntry,
  filterMessagesByDateRange,
  updateSummaryCollection
} from '../../../../lib/summaries';

const DEFAULT_DAYS = 2;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const type = body.type === 'weekly' ? 'weekly' : 'daily';
    const days = typeof body.days === 'number' && body.days > 0 ? body.days : DEFAULT_DAYS;

    const messages = await getConversationMessages();

    if (messages.length === 0) {
      return NextResponse.json({
        success: true,
        type,
        summary: null,
        messageCount: 0
      });
    }

    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - days);

    const selectedMessages = filterMessagesByDateRange(messages, start, now);
    const messageCount = selectedMessages.length;

    if (type === 'weekly') {
      const collection = await getWeeklySummaryCollection();
      const weekStart = start.toISOString().slice(0, 10);
      const weekEnd = now.toISOString().slice(0, 10);
      const entry = buildWeeklyEntry(weekStart, weekEnd, selectedMessages);
      const nextCollection = updateSummaryCollection(collection, entry);
      await setWeeklySummaryCollection(nextCollection);

      return NextResponse.json({
        success: true,
        type,
        summary: entry,
        messageCount,
        collection: nextCollection
      });
    }

    const collection = await getDailySummaryCollection();
    const date = now.toISOString().slice(0, 10);
    const entry = buildDailyEntry(date, selectedMessages);
    const nextCollection = updateSummaryCollection(collection, entry);
    await setDailySummaryCollection(nextCollection);

    return NextResponse.json({
      success: true,
      type,
      summary: entry,
      messageCount,
      collection: nextCollection
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
