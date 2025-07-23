import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repoFullName = searchParams.get('repo');

    if (!repoFullName) {
      return NextResponse.json({ error: 'Repository name is required' }, { status: 400 });
    }

    const [owner, repo] = repoFullName.split('/');

    // Check if GitHub App is installed via backend service
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    console.log('Attempting to connect to backend:', backendUrl);
    
    const backendResponse = await fetch(`${backendUrl}/api/github-app/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner, repo }),
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ 
        isInstalled: false, 
        error: 'Failed to check GitHub App status' 
      }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json({
      isInstalled: data.isInstalled,
      permissions: data.permissions || {},
      installationId: data.installationId,
      appName: process.env.NEXT_PUBLIC_GITHUB_APP_NAME || 'Latchkey.io'
    });

  } catch (error) {
    console.error('GitHub App status check error:', error);
    
    // Handle connection refused errors
    if (error && typeof error === 'object' && 'cause' in error && 
        error.cause && typeof error.cause === 'object' && 'code' in error.cause && 
        error.cause.code === 'ECONNREFUSED') {
      return NextResponse.json({ 
        isInstalled: false, 
        error: 'Backend service unavailable. Please ensure the backend server is running on port 4000.' 
      });
    }
    
    return NextResponse.json({ 
      isInstalled: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}