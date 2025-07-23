import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  // 1. Authenticate the user
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Get the user's GitHub OAuth access token from Clerk
  const tokens = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_github');
  const githubToken = tokens?.[0]?.token;

  if (!githubToken) {
    return NextResponse.json({ error: 'No GitHub token found' }, { status: 401 });
  }

  // 3. Parse query parameters for pagination
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '30';

  // 4. Fetch the user's repos from GitHub with pagination
  const res = await fetch(`https://api.github.com/user/repos?page=${page}&per_page=${perPage}&sort=updated`, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch repos from GitHub' }, { status: 500 });
  }

  const repos = await res.json();
  
  // 5. Check if there are more pages by looking at the Link header
  const linkHeader = res.headers.get('link');
  const hasNextPage = linkHeader && linkHeader.includes('rel="next"');

  // 6. Return the repos with pagination metadata
  return NextResponse.json({
    repos,
    pagination: {
      page: parseInt(page),
      perPage: parseInt(perPage),
      hasNextPage,
    }
  });
}
