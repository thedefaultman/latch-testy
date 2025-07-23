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

    // Fetch repository contents to detect project type
    const contentsResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/contents`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!contentsResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch repository contents' }, { status: 500 });
    }

    const contents = await contentsResponse.json();
    
    // Detect project type based on signature files
    const projectType = detectProjectType(contents);
    
    return NextResponse.json({ 
      projectType,
      contents: contents.slice(0, 10) // Return first 10 items for UI display
    });

  } catch (error) {
    console.error('Error inspecting repository:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface GitHubContent {
  name: string;
  type: string;
  path: string;
}

function detectProjectType(contents: GitHubContent[]): string {
  const fileNames = contents.map(item => item.name.toLowerCase());
  
  // Check for signature files
  if (fileNames.includes('package.json')) {
    return 'nodejs';
  }
  
  if (fileNames.includes('dockerfile')) {
    return 'docker';
  }
  
  if (fileNames.includes('projectsettings') || fileNames.some(name => name.includes('unity'))) {
    return 'unity';
  }
  
  if (fileNames.includes('.uproject')) {
    return 'unreal';
  }
  
  if (fileNames.includes('pom.xml')) {
    return 'java';
  }
  
  if (fileNames.includes('requirements.txt') || fileNames.includes('setup.py')) {
    return 'python';
  }
  
  if (fileNames.includes('go.mod')) {
    return 'go';
  }
  
  if (fileNames.includes('cargo.toml')) {
    return 'rust';
  }
  
  // Default to web app if no specific signature found
  return 'web';
} 