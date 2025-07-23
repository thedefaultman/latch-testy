import { NextRequest, NextResponse } from 'next/server';

// Proxy GET /api/pipelines/[pipelineId]/logs to backend
export async function GET(req: NextRequest, context: { params: { pipelineId: string } }) {
  const { pipelineId } = await context.params;
  const backendUrl = `http://localhost:4000/api/pipelines/${pipelineId}/logs`;
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
  } catch {
    return NextResponse.json({ error: 'Failed to reach backend for logs.' }, { status: 500 });
  }
} 