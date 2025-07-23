import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: { pipelineId: string } }) {
  const { pipelineId } = await context.params;
  const backendUrl = `http://localhost:4000/api/pipelines/${pipelineId}`;
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
    return NextResponse.json({ error: 'Failed to reach backend for pipeline.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { pipelineId: string } }) {
  const { pipelineId } = await context.params;
  const backendUrl = `http://localhost:4000/api/pipelines/${pipelineId}`;
  try {
    const res = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return new NextResponse(null, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to delete pipeline.' }, { status: 500 });
  }
} 