import { NextResponse } from 'next/server';
import { getDailySummaryCollection, getWeeklySummaryCollection } from '../../../../lib/kv-store';

export async function GET() {
  try {
    const [daily, weekly] = await Promise.all([
      getDailySummaryCollection(),
      getWeeklySummaryCollection()
    ]);

    return NextResponse.json({ daily, weekly });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
