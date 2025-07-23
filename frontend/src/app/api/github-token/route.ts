import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    // 1. Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Please sign in to access GitHub token'
      }, { status: 401 });
    }

    // 2. Get the user's GitHub OAuth access token from Clerk
    const tokens = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_github');
    const githubToken = tokens?.[0]?.token;

    if (!githubToken) {
      return NextResponse.json({ 
        error: 'GitHub token not found',
        message: 'Please ensure you are signed in with GitHub OAuth'
      }, { status: 401 });
    }

    return NextResponse.json({ 
      token: githubToken,
      message: 'GitHub token retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting GitHub token:', error);
    return NextResponse.json({ 
      error: 'Failed to get GitHub token',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 