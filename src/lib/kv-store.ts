import { kv } from '@vercel/kv';
import type { Program } from '../types/program';

const PROGRAM_KEY = 'program:current';
const STRAVA_TOKENS_KEY = 'strava:tokens';

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

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
