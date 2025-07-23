import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repoFullName } = await request.json();
    if (!repoFullName) {
      return NextResponse.json({ error: 'Repository name required' }, { status: 400 });
    }

    // Get user's GitHub token
    const tokens = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_github');
    const githubToken = tokens[0]?.token;

    if (!githubToken) {
      return NextResponse.json({ error: 'GitHub token not found' }, { status: 401 });
    }

    // Fetch branches from GitHub
    const branchesResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/branches`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!branchesResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch branches from GitHub' }, { status: 500 });
    }

    const branches = await branchesResponse.json();
    // Return array of branch names
    const branchNames = Array.isArray(branches) ? (branches as { name: string }[]).map((b) => b.name) : [];
    return NextResponse.json({ branches: branchNames });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 