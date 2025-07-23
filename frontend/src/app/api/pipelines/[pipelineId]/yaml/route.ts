import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, context: { params: { pipelineId: string } }) {
  const { pipelineId } = await context.params;
  const backendUrl = `http://localhost:4000/api/pipelines/${pipelineId}/yaml`;
  
  try {
    const body = await req.json();
    const res = await fetch(backendUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reach backend for YAML update.' }, { status: 500 });
  }
} 