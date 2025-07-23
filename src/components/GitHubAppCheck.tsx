'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, ExternalLink, RefreshCw, Github, Shield, Zap, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface GitHubAppStatus {
  isInstalled: boolean;
  installationId?: number;
  permissions?: Record<string, string>;
  appName?: string;
  installUrl?: string;
  error?: string;
}

interface GitHubAppCheckProps {
  repoFullName: string;
  onStatusChange: (isInstalled: boolean) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  className?: string;
}

export function GitHubAppCheck({ repoFullName, onStatusChange, onLoadingChange, className }: GitHubAppCheckProps) {
  const [status, setStatus] = useState<GitHubAppStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hasChecked, setHasChecked] = useState(false);

  const checkAppStatus = async (showToast = true) => {
    if (!repoFullName) return;

    setLoading(true);
    onLoadingChange?.(true);
    setHasChecked(true);
    
    try {
      console.log('Checking GitHub App status for:', repoFullName);
      const response = await fetch(`/api/github-app-status?repo=${encodeURIComponent(repoFullName)}`);
      const data = await response.json();
      
      console.log('GitHub App status response:', data);
      console.log('isInstalled:', data.isInstalled);
      console.log('error:', data.error);
      setStatus(data);
      onStatusChange(data.isInstalled);
      
      if (showToast) {
        if (data.isInstalled) {
          toast.success('GitHub App is installed and ready!');
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error('GitHub App is not installed');
        }
      }
    } catch (error) {
      console.error('Error checking GitHub App status:', error);
      const errorStatus = {
        isInstalled: false,
        error: 'Failed to check installation status'
      };
      setStatus(errorStatus);
      onStatusChange(false);
      
      if (showToast) {
        toast.error('Failed to check GitHub App status');
      }
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  const handleInstall = () => {
    const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME || 'latchkey-io';
    const installUrl = `https://github.com/apps/${appName}/installations/new?state=${encodeURIComponent(repoFullName)}`;
    
    // Open in new tab
    window.open(installUrl, '_blank', 'noopener,noreferrer');
    
    // Don't auto-retry - let user manually check when done
    setRetryCount(prev => prev + 1);
    toast.info('After installing, click "Check Again" to verify the installation');
  };

  const handleRetry = () => {
    if (retryCount >= 5) {
      toast.error('Too many retry attempts. Please refresh the page and try again.');
      return;
    }
    setRetryCount(prev => prev + 1);
    checkAppStatus(true);
  };

  useEffect(() => {
    // Reset status when repo changes - but don't auto-check
    if (repoFullName) {
      setStatus(null);
      setRetryCount(0);
      setHasChecked(false);
    }
  }, [repoFullName]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span className="text-muted-foreground">Checking GitHub App installation...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show initial state if never checked
  if (!hasChecked) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub App Setup Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <Github className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Ready to check GitHub App
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Click "Check Installation" to verify if our GitHub App is installed on <strong>{repoFullName}</strong>.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => checkAppStatus()}
              className="flex-1"
              size="lg"
            >
              <Github className="w-4 h-4 mr-2" />
              Check Installation
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>
              <strong>What we check:</strong> Whether our GitHub App has the necessary permissions to create CI/CD workflows for your repository.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) return null;

  console.log('Rendering with status:', status);
  console.log('status.isInstalled:', status.isInstalled);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          GitHub App Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.isInstalled ? (
          // App is installed - success state
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  GitHub App Installed ✨
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your repository is connected and ready for pipeline creation
                </p>
              </div>
            </div>

            {/* Permissions Status */}
            {status.permissions && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(status.permissions).map(([permission, access]) => (
                  <div key={permission} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="capitalize">{permission.replace('_', ' ')}</span>
                    <span className="text-muted-foreground">({access})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // App is not installed - installation flow
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 dark:text-amber-100">
                  {status?.error && status.error.includes('credentials') 
                    ? 'GitHub App Setup Required'
                    : 'GitHub App Required'
                  }
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  {status?.error && status.error.includes('credentials') 
                    ? 'GitHub App credentials need to be configured by your administrator to enable pipeline creation.'
                    : `Latchkey.io GitHub App is not installed on ${repoFullName}. Click "Install GitHub App" below to install it and continue with pipeline creation.`
                  }
                </p>
              </div>
            </div>

            {/* What happens when you install */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Secure access only</span>
              </div>
              <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Zap className="w-4 h-4 text-purple-500" />
                <span>Auto workflow creation</span>
              </div>
              <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Clock className="w-4 h-4 text-green-500" />
                <span>Takes 30 seconds</span>
              </div>
            </div>

            {/* Installation buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleInstall}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                disabled={status?.error && status.error.includes('credentials')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {status?.error && status.error.includes('credentials') 
                  ? 'App Setup Required by Admin'
                  : 'Install Latchkey.io App'
                }
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleRetry}
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  'Check Again'
                )}
              </Button>
            </div>


            {/* Help text */}
            <div className="text-xs text-muted-foreground space-y-2">
              <p>
                <strong>What we access:</strong> Only repository metadata and the ability to create workflow files.
                We never read your source code.
              </p>
              <p>
                <strong>After installation:</strong> Click "Check Again" and we'll automatically detect the installation.
              </p>
              <p>
                <strong>Need help?</strong> Visit our <a href="/install-github-app" className="text-blue-600 hover:text-blue-800 underline">detailed installation guide</a> for step-by-step instructions.
              </p>
            </div>
          </div>
        )}

        {status.error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">
              {status.error}
            </span>
            <Button variant="ghost" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}