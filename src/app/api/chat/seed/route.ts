import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  setConversationMessages,
  setConversationDashboard
} from '../../../../lib/kv-store';
import type { ConversationData, ConversationMessage } from '../../../../types/conversation';

export async function POST() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'conversation.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent) as ConversationData;

    const now = new Date().toISOString();
    const messages: ConversationMessage[] = data.messages.map((message) => ({
      ...message,
      id: message.id ?? Date.now(),
      createdAt: now
    }));

    await Promise.all([
      setConversationMessages(messages),
      setConversationDashboard(data.dashboard)
    ]);

    return NextResponse.json({ success: true, count: messages.length });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
