import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

const KEY = 'rsvp-responses';

export async function POST(request: Request) {
  const body = await request.json();
  const entry = { ...body, timestamp: new Date().toISOString() };
  await redis.lpush(KEY, JSON.stringify(entry));
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const items = await redis.lrange(KEY, 0, -1);
  const parsed = items.map(item => JSON.parse(item));
  return NextResponse.json(parsed);
}

export async function DELETE() {
  await redis.del(KEY);
  return NextResponse.json({ ok: true });
}
