'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, ExternalLink, RefreshCw, Github, Shield, Zap, Clock, Users, Star, ArrowRight, Copy, Check, Play, Settings, Lock, FileCode, GitBranch } from 'lucide-react';

interface Repo {
  id: number
  full_name: string
  description: string | null
}

interface GitHubPermission {
  name: string
  access: string
  description: string
  icon: React.ReactNode
}

export default function InstallGitHubAppPage() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  // Installation steps with visual progress
  const installationSteps = [
    {
      id: 1,
      title: 'Install GitHub App',
      description: 'Connect your repositories to SaasPipeline',
      action: 'Install App',
      completed: false
    },
    {
      id: 2,
      title: 'Configure Permissions',
      description: 'Enable GitHub Actions write permissions',
      action: 'Configure',
      completed: false
    },
    {
      id: 3,
      title: 'Create Pipeline',
      description: 'Start building your first pipeline',
      action: 'Get Started',
      completed: false
    }
  ];

  // GitHub permissions required
  const requiredPermissions: GitHubPermission[] = [
    {
      name: 'Contents',
      access: 'Read & Write',
      description: 'Create and modify workflow files',
      icon: <FileCode className="w-4 h-4" />
    },
    {
      name: 'Actions',
      access: 'Write',
      description: 'Trigger and manage GitHub Actions',
      icon: <Play className="w-4 h-4" />
    },
    {
      name: 'Metadata',
      access: 'Read',
      description: 'Access repository information',
      icon: <Settings className="w-4 h-4" />
    },
    {
      name: 'Pull Requests',
      access: 'Write',
      description: 'Create preview deployments',
      icon: <GitBranch className="w-4 h-4" />
    }
  ];

  const fetchRepos = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/github-repos')
      if (res.ok) {
        const reposData = await res.json()
        setRepos(reposData)
      } else {
        toast.error('Failed to fetch repositories')
      }
    } catch {
      toast.error('Error fetching repositories')
    } finally {
      setLoading(false)
    }
  }

  const installApp = (repoFullName?: string) => {
    const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME || 'saaspipeline'
    const appInstallUrl = `https://github.com/apps/${appName}/installations/new${repoFullName ? `?state=${repoFullName}` : ''}`
    window.open(appInstallUrl, '_blank')
  }

  const copyToClipboard = async (text: string, stepId: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStep(stepId)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopiedStep(null), 2000)
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Github className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GitHub App Setup
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect your repositories to SaasPipeline and automate your CI/CD workflows
          </p>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure & Trusted</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-blue-500" />
              <span>10,000+ Developers</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>5-Star Security</span>
            </div>
          </div>
        </div>

        {/* Installation Steps Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            {installationSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm ${
                  activeStep >= step.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-400 border-gray-300'
                }`}>
                  {step.completed ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="ml-3 mr-8">
                  <div className={`font-medium ${activeStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500">{step.description}</div>
                </div>
                {index < installationSteps.length - 1 && (
                  <ArrowRight className={`w-5 h-5 mx-4 ${activeStep > step.id ? 'text-blue-600' : 'text-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Step 1: Install GitHub App */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Github className="w-5 h-5 text-blue-600" />
                </div>
                Step 1: Install GitHub App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What happens:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Secure OAuth connection</li>
                  <li>• Repository access permissions</li>
                  <li>• Automated workflow creation</li>
                </ul>
              </div>

              <Button 
                onClick={() => installApp()} 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                size="lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Install GitHub App
              </Button>

              <div className="text-center">
                <button 
                  onClick={fetchRepos}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  {loading ? 'Loading repositories...' : 'Or browse your repositories first'}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Configure Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Settings className="w-5 h-5 text-amber-600" />
                </div>
                Step 2: Configure Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium text-amber-900 mb-2">GitHub Actions Setup:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-700">1.</span>
                    <span className="text-amber-700">Go to Repository → Settings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-700">2.</span>
                    <span className="text-amber-700">Click Actions → General</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-700">3.</span>
                    <span className="text-amber-700">Enable "Read and write permissions"</span>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => copyToClipboard('Settings > Actions > General > Workflow permissions > Read and write permissions', 2)}
              >
                {copiedStep === 2 ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Instructions
                  </>
                )}
              </Button>

              <a 
                href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 underline"
              >
                View detailed guide →
              </a>
            </CardContent>
          </Card>

          {/* Step 3: Create Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                Step 3: Create Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Ready to build:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Choose your project type</li>
                  <li>• Configure deployment</li>
                  <li>• Launch your pipeline</li>
                </ul>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                size="lg"
                onClick={() => window.location.href = '/dashboard/new'}
              >
                <Play className="w-4 h-4 mr-2" />
                Create Pipeline
              </Button>

              <div className="text-center text-sm text-gray-500">
                Takes less than 5 minutes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security & Permissions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">We never read your code</div>
                    <div className="text-sm text-gray-600">Only workflow files are created/modified</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">SOC 2 Type II Compliant</div>
                    <div className="text-sm text-gray-600">Enterprise-grade security standards</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Minimal permissions</div>
                    <div className="text-sm text-gray-600">Only what's needed for CI/CD workflows</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Required Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requiredPermissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-600">
                      {permission.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{permission.name}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {permission.access}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {permission.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Repository Browser */}
        {repos.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                Your Repositories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {repos.map((repo) => (
                  <div key={repo.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-medium">{repo.full_name}</h3>
                      <p className="text-sm text-gray-600">{repo.description || 'No description'}</p>
                    </div>
                    <Button
                      onClick={() => installApp(repo.full_name)}
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Install App
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ & Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">What permissions does the app need?</h4>
                <p className="text-sm text-gray-600">
                  Only the minimum required for CI/CD: creating workflow files, triggering actions, 
                  and reading repository metadata. We never access your source code.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Is my code secure?</h4>
                <p className="text-sm text-gray-600">
                  Yes! We only create workflow files in your .github/workflows directory. 
                  Your source code remains completely private and untouched.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Can I uninstall the app anytime?</h4>
                <p className="text-sm text-gray-600">
                  Absolutely! You can uninstall the GitHub App from your GitHub settings 
                  at any time. Your repositories and code remain unaffected.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">What if I have issues?</h4>
                <p className="text-sm text-gray-600">
                  Our support team is available 24/7. Contact us through the chat widget 
                  or email support@saaspipeline.com for immediate assistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 