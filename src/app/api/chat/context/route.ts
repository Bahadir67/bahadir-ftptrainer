import { NextResponse } from 'next/server';
import { buildConversationContext } from '../../../../lib/kv-store';

export async function GET() {
  try {
    const context = await buildConversationContext();
    return NextResponse.json(context);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
