import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const backendUrl = 'http://localhost:4000/api/pipeline/logs';
  const search = req.nextUrl.search;
  try {
    const res = await fetch(`${backendUrl}${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to reach backend for logs.' }, { status: 500 });
  }
} 