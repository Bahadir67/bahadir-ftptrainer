import { NextResponse } from 'next/server';
import { appendConversationMessage, buildConversationContext } from '../../../lib/kv-store';
import type { ConversationMessage } from '../../../types/conversation';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const now = new Date();
    const timestamp = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const newMessage: ConversationMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp,
      createdAt: now.toISOString()
    };

    const messages = await appendConversationMessage(newMessage);
    const context = await buildConversationContext();

    return NextResponse.json({ success: true, data: { messages }, context });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
