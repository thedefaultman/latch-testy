import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, context: { params: { pipelineId: string } }) {
  const { pipelineId } = await context.params;
  const backendUrl = `http://localhost:4000/api/pipelines/${pipelineId}/rerun`;
  try {
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: await req.text(), // Pass through any body (if needed)
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reach backend for pipeline re-run.' }, { status: 500 });
  }
} 