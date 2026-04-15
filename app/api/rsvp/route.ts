import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY = 'rsvp-responses';

export async function POST(request: Request) {
  const body = await request.json();
  const entry = { ...body, timestamp: new Date().toISOString() };
  await redis.lpush(KEY, JSON.stringify(entry));
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const items = await redis.lrange(KEY, 0, -1);
  const parsed = items.map(item =>
    typeof item === 'string' ? JSON.parse(item) : item
  );
  return NextResponse.json(parsed);
}

export async function DELETE() {
  await redis.del(KEY);
  return NextResponse.json({ ok: true });
}
