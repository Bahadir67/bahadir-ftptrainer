import { NextResponse } from 'next/server';
import { getConversationMemory, setConversationMemory } from '../../../../lib/kv-store';

export async function GET() {
  try {
    const memory = await getConversationMemory();
    return NextResponse.json({ memory });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { memory } = body;

    if (!memory) {
      return NextResponse.json({ error: 'Memory is required' }, { status: 400 });
    }

    await setConversationMemory(memory);
    return NextResponse.json({ success: true, memory });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
