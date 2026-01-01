import { NextResponse } from 'next/server';
import { getConversationMessages, getConversationDashboard } from '../../../lib/kv-store';
import type { ConversationData } from '../../../types/conversation';

const DEFAULT_DASHBOARD: ConversationData['dashboard'] = {
  title: 'Ağırlık A - Temel Güç',
  duration: '45dk',
  tss: 0,
  type: 'strength_a',
  status: 'Güncel'
};

export async function GET() {
  try {
    const [messages, dashboard] = await Promise.all([
      getConversationMessages(),
      getConversationDashboard()
    ]);

    const payload: ConversationData = {
      messages,
      dashboard: dashboard ?? DEFAULT_DASHBOARD
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
