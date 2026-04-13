import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), 'rsvp-responses.json');

export async function POST(request: Request) {
  const body = await request.json();
  const entry = { ...body, timestamp: new Date().toISOString() };

  let list: unknown[] = [];
  try {
    list = JSON.parse(await readFile(FILE, 'utf-8'));
  } catch {
    await mkdir(path.dirname(FILE), { recursive: true });
  }

  list.push(entry);
  await writeFile(FILE, JSON.stringify(list, null, 2));

  return NextResponse.json({ ok: true });
}

export async function GET() {
  try {
    const data = await readFile(FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json([]);
  }
}
