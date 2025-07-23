"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Check, Code, Package, Gamepad2, Cpu, Globe, FileCode, Coffee, Terminal, Settings, FolderOpen, Cog, Database, GitBranch, Shield, Eye, Search, Filter, Star, Clock, Users, FileText, Copy, ExternalLink, Zap, Play, Layers, BarChart3, Smartphone } from "lucide-react";
import { toast } from 'sonner';
import { GitHubAppCheck } from '@/components/GitHubAppCheck';

interface Repo {
  id: number;
  full_name: string;
}

interface PipelineConfig {
  repo: Repo | null;
  projectType: string;
  runner: string;
  storage: string;
  branches: string[];
  // Unity specific configuration
  unityLicenseType?: 'personal' | 'professional';
  unityLicense?: string; // For personal license (.ulf file content)
  unityEmail?: string; // For professional license
  unityPassword?: string; // For professional license
  unitySerial?: string; // For professional license
  // Web application specific configuration
  webFramework?: string; // react, vue, angular, nextjs, nuxt, vite, static
  hostingPlatform?: 'vercel' | 'netlify' | 'github-pages' | 'railway' | 'render';
  customDomain?: string;
  environmentVariables?: Record<string, string>;
  // Hosting platform credentials (will be stored as GitHub secrets)
  vercelToken?: string;
  vercelOrgId?: string;
  vercelProjectId?: string;
  netlifyAuthToken?: string;
  netlifySiteId?: string;
  // Node.js hosting platforms
  railwayToken?: string;
  railwayServiceId?: string;
  renderApiKey?: string;
  renderServiceId?: string;
  // Mobile app specific configuration
  mobileFramework?: 'react-native' | 'flutter' | 'ios-native' | 'android-native' | 'xamarin' | 'ionic';
  buildVariant?: 'debug' | 'release';
  targetPlatforms?: Array<'ios' | 'android'>;
  // React Native specific
  reactNativeVersion?: string;
  // Flutter specific
  flutterVersion?: string;
  flutterChannel?: 'stable' | 'beta' | 'dev' | 'master';
  // iOS specific
  iosVersion?: string;
  xcodeVersion?: string;
  iosBundleId?: string;
  iosTeamId?: string;
  iosProvisioningProfile?: string;
  // Android specific
  androidSdkVersion?: string;
  androidBuildToolsVersion?: string;
  androidPackageName?: string;
  androidKeystore?: string;
  androidKeystorePassword?: string;
  androidKeyAlias?: string;
  androidKeyPassword?: string;
  // App store deployment
  appStoreDeployment?: boolean;
  playStoreDeployment?: boolean;
  // Distribution platforms
  distributionPlatforms?: Array<'app-store' | 'play-store' | 'firebase-distribution' | 'testflight' | 'internal'>;
}

const WIZARD_STEPS = [
  { 
    id: 'repo', 
    title: 'Repository', 
    shortTitle: 'Repo',
    description: 'Choose the repository for your pipeline',
    icon: <FolderOpen className="w-5 h-5" />
  },
  { 
    id: 'project', 
    title: 'Project Type', 
    shortTitle: 'Type',
    description: 'Confirm or change the detected project type',
    icon: <Code className="w-5 h-5" />
  },
  { 
    id: 'runner', 
    title: 'Runner', 
    shortTitle: 'Runner',
    description: 'Configure your build runner',
    icon: <Cog className="w-5 h-5" />
  },
  { 
    id: 'storage', 
    title: 'Storage', 
    shortTitle: 'Storage',
    description: 'Configure artifact storage',
    icon: <Database className="w-5 h-5" />
  },
  { 
    id: 'branches', 
    title: 'Branches', 
    shortTitle: 'Branches',
    description: 'Select branches that trigger the pipeline',
    icon: <GitBranch className="w-5 h-5" />
  },
  { 
    id: 'unity', 
    title: 'Unity Config', 
    shortTitle: 'Unity',
    description: 'Configure Unity-specific settings',
    icon: <Shield className="w-5 h-5" />
  },
  { 
    id: 'web', 
    title: 'Web Config', 
    shortTitle: 'Web',
    description: 'Configure web application deployment settings',
    icon: <Globe className="w-5 h-5" />
  },
  { 
    id: 'mobile', 
    title: 'Mobile Config', 
    shortTitle: 'Mobile',
    description: 'Configure mobile app build settings',
    icon: <Code className="w-5 h-5" />
  },
  { 
    id: 'review', 
    title: 'Review & Launch', 
    shortTitle: 'Review',
    description: 'Review configuration and launch pipeline',
    icon: <Eye className="w-5 h-5" />
  }
];

export default function NewPipelinePage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [branches, setBranches] = useState<string[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  const [githubAppInstalled, setGithubAppInstalled] = useState(false);
  const [githubAppCheckLoading, setGithubAppCheckLoading] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  
  const [config, setConfig] = useState<PipelineConfig>({
    repo: null,
    projectType: "",
    runner: "github-actions",
    storage: "aws-s3",
    branches: [],
  });

  useEffect(() => {
    async function fetchRepos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/github-repos");
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to fetch repositories");
          setRepos([]);
        } else {
          const data = await res.json();
          setRepos(data.repos || data);
          setFilteredRepos(data.repos || data);
          setHasNextPage(data.pagination?.hasNextPage || false);
          setCurrentPage(data.pagination?.page || 1);
        }
      } catch {
        setError("Network error");
        setRepos([]);
        setFilteredRepos([]);
      }
      setLoading(false);
    }
    fetchRepos();
  }, []);

  // Search and filter effect
  useEffect(() => {
    let filtered = [...repos];
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(repo =>
        repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedFilter !== "all") {
      // For now, we'll simulate filtering by owner type
      // In a real app, you'd have more metadata about repos
      filtered = filtered.filter(repo => {
        const owner = repo.full_name.split('/')[0];
        switch (selectedFilter) {
          case "personal":
            return owner.toLowerCase() === owner; // Simple heuristic
          case "organization":
            return owner.toLowerCase() !== owner; // Simple heuristic
          case "recent":
            return true; // Would use actual timestamp data
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.full_name.localeCompare(b.full_name);
        case "recent":
          return b.id - a.id; // Using ID as proxy for recency
        case "owner":
          return a.full_name.split('/')[0].localeCompare(b.full_name.split('/')[0]);
        default:
          return 0;
      }
    });
    
    setFilteredRepos(filtered);
  }, [repos, searchQuery, selectedFilter, sortBy]);

  const loadMoreRepos = async () => {
    if (loadingMore || !hasNextPage) return;
    
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const res = await fetch(`/api/github-repos?page=${nextPage}`);
      if (res.ok) {
        const data = await res.json();
        const newRepos = [...repos, ...(data.repos || data)];
        setRepos(newRepos);
        setHasNextPage(data.pagination?.hasNextPage || false);
        setCurrentPage(data.pagination?.page || nextPage);
      } else {
        toast.error('Failed to load more repositories');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoadingMore(false);
    }
  };

  // Fetch branches after repo selection
  useEffect(() => {
    if (config.repo) {
      setBranchesLoading(true);
      setBranchesError(null);
      fetch("/api/github-branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoFullName: config.repo.full_name }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok) {
            setBranches(data.branches || []);
          } else {
            setBranchesError(data.error || "Failed to fetch branches");
            setBranches([]);
          }
        })
        .catch(() => {
          setBranchesError("Network error");
          setBranches([]);
        })
        .finally(() => setBranchesLoading(false));
    }
  }, [config.repo]);

  const handleRepoSelect = async (repo: Repo) => {
    setLoading(true);
    try {
      // Inspect the repository to detect project type
      const res = await fetch("/api/repo-inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoFullName: repo.full_name }),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig((prev) => ({
          ...prev,
          repo,
          projectType: data.projectType,
        }));
        // Reset GitHub App status when repo changes
        setGithubAppInstalled(false);
        setGithubAppCheckLoading(true);
        // Don't auto-advance - let the user complete GitHub App installation first
      } else {
        toast.error("Failed to inspect repository");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectTypeChange = (projectType: string) => {
    setConfig((prev) => ({ ...prev, projectType }));
  };

  const handleRunnerChange = (runner: string) => {
    setConfig((prev) => ({ ...prev, runner }));
  };

  const handleStorageChange = (storage: string) => {
    setConfig((prev) => ({ ...prev, storage }));
  };

  const handleBranchToggle = (branch: string) => {
    setConfig((prev) => {
      const exists = prev.branches.includes(branch);
      return {
        ...prev,
        branches: exists
          ? prev.branches.filter((b) => b !== branch)
          : [...prev.branches, branch],
      };
    });
  };

  // Get visible steps (exclude Unity if not Unity project, exclude Web if not Web project, exclude Mobile if not Mobile project)
  const visibleSteps = WIZARD_STEPS.filter(step => 
    (step.id !== 'unity' || config.projectType === 'unity') &&
    (step.id !== 'web' || ['web', 'nodejs'].includes(config.projectType)) &&
    (step.id !== 'mobile' || config.projectType === 'mobile')
  );
  const currentStepData = visibleSteps[currentStep];

  // Wizard navigation functions
  const nextStep = () => {
    const nextStepIndex = currentStep + 1;
    if (nextStepIndex < visibleSteps.length) {
      setCurrentStep(nextStepIndex);
    }
  };

  const prevStep = () => {
    const prevStepIndex = currentStep - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(prevStepIndex);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < visibleSteps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const isStepComplete = (stepId: string): boolean => {
    switch (stepId) {
      case 'repo':
        return !!config.repo && !githubAppCheckLoading && githubAppInstalled;
      case 'project':
        return !!config.projectType;
      case 'runner':
        return !!config.runner;
      case 'storage':
        return !!config.storage;
      case 'branches':
        return config.branches.length > 0;
      case 'unity':
        if (config.projectType !== 'unity') return true;
        return !!config.unityLicenseType && (
          (config.unityLicenseType === 'personal' && !!config.unityLicense) ||
          (config.unityLicenseType === 'professional' && !!config.unityEmail && !!config.unityPassword && !!config.unitySerial)
        );
      case 'web':
        if (!['web', 'nodejs'].includes(config.projectType)) return true;
        return !!config.hostingPlatform && (
          (config.hostingPlatform === 'vercel' && !!config.vercelToken) ||
          (config.hostingPlatform === 'netlify' && !!config.netlifyAuthToken) ||
          (config.hostingPlatform === 'railway' && !!config.railwayToken) ||
          (config.hostingPlatform === 'render' && !!config.renderApiKey) ||
          (config.hostingPlatform === 'github-pages') // GitHub Pages doesn't need additional credentials
        );
      case 'mobile':
        if (config.projectType !== 'mobile') return true;
        return !!config.mobileFramework && !!config.targetPlatforms && config.targetPlatforms.length > 0;
      case 'review':
        // Review step is complete if all required configuration is done
        const hasRepo = !!config.repo && !githubAppCheckLoading && githubAppInstalled;
        const hasProjectType = !!config.projectType;
        const hasRunner = !!config.runner;
        const hasStorage = !!config.storage;
        const hasBranches = config.branches.length > 0;
        const unityComplete = config.projectType === 'unity' 
          ? !!config.unityLicenseType && (
              (config.unityLicenseType === 'personal' && !!config.unityLicense) ||
              (config.unityLicenseType === 'professional' && !!config.unityEmail && !!config.unityPassword && !!config.unitySerial)
            )
          : true;
        const webComplete = ['web', 'nodejs'].includes(config.projectType)
          ? !!config.hostingPlatform && (
              (config.hostingPlatform === 'vercel' && !!config.vercelToken) ||
              (config.hostingPlatform === 'netlify' && !!config.netlifyAuthToken) ||
              (config.hostingPlatform === 'railway' && !!config.railwayToken) ||
              (config.hostingPlatform === 'render' && !!config.renderApiKey) ||
              (config.hostingPlatform === 'github-pages')
            )
          : true;
        const mobileComplete = config.projectType === 'mobile'
          ? !!config.mobileFramework && !!config.targetPlatforms && config.targetPlatforms.length > 0
          : true;
        
        return hasRepo && hasProjectType && hasRunner && hasStorage && hasBranches && unityComplete && webComplete && mobileComplete;
      default:
        return false;
    }
  };

  const canProceed = () => {
    const currentStepId = currentStepData?.id;
    return isStepComplete(currentStepId);
  };

  const getStepMessage = () => {
    const currentStepId = currentStepData?.id;
    if (currentStepId === 'repo') {
      if (!config.repo) {
        return 'Select a repository to continue';
      } else if (githubAppCheckLoading) {
        return 'Checking GitHub App status...';
      } else if (!githubAppInstalled) {
        return 'Install GitHub App to continue';
      }
      return 'Ready to proceed';
    }
    return canProceed() ? 'Ready to proceed' : 'Complete required fields';
  };

  // Generate workflow preview
  const generateWorkflowPreview = () => {
    if (!config.projectType) return "";
    
    const branches = config.branches.length > 0 ? config.branches : ['main'];
    const branchesYaml = branches.join(', ');
    
    const baseWorkflow = `name: ${config.projectType.toUpperCase()} CI/CD Pipeline

on:
  push:
    branches: [ ${branchesYaml} ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:`;

    switch (config.projectType) {
      case 'nodejs':
        return `${baseWorkflow}
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - name: Install dependencies
      run: npm ci
    - name: Build application
      run: npm run build
    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-files
        path: dist/
        retention-days: 30`;

      case 'docker':
        return `${baseWorkflow}
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        file: Dockerfile
        push: true
        tags: \${{ github.repository }}:latest`;

      case 'python':
        return `${baseWorkflow}
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    - name: Build package
      run: python setup.py sdist bdist_wheel`;

      default:
        return `${baseWorkflow}
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup environment
      run: echo "Setting up ${config.projectType} environment"
    - name: Build project
      run: echo "Building ${config.projectType} project"
    - name: Run tests
      run: echo "Running tests"`;
    }
  };

  const handleLaunch = async () => {
    try {
      const res = await fetch("/api/pipeline/provision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok) {
        const successMessage = [
          `✅ Pipeline provisioned successfully!`,
          `ID: ${data.pipelineId}`,
          data.workflowUrl ? `Workflow: ${data.workflowUrl}` : "",
          data.logs ? `\nLogs:\n${data.logs.join("\n")}` : "",
        ]
          .filter(Boolean)
          .join("\n");
        toast.success(successMessage);
        setTimeout(() => {
          window.location.href = "/dashboard/pipelines";
        }, 2000);
      } else {
        toast.error(
          `❌ Error: ${data.error || data.message || "Failed to provision pipeline"}`
        );
      }
    } catch {
      toast.error("Network error");
    }
  };

  // Progress indicator component
  const ProgressIndicator = () => {
    const progressPercentage = ((currentStep + 1) / visibleSteps.length) * 100;
    
    return (
      <div className="mb-8">
        {/* Header with title and step counter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Create New Pipeline
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentStepData?.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {currentStep + 1}<span className="text-lg text-muted-foreground">/{visibleSteps.length}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
        </div>
        
        {/* Enhanced progress bar */}
        <div className="relative mb-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out shadow-sm relative overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          
          {/* Step markers on progress bar */}
          {visibleSteps.map((_, index) => (
            <div
              key={index}
              className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background transition-colors duration-300"
              style={{ 
                left: `${(index / (visibleSteps.length - 1)) * 100}%`,
                marginLeft: index === 0 ? '0' : index === visibleSteps.length - 1 ? '-12px' : '-6px'
              }}
            >
              <div className={`w-full h-full rounded-full transition-colors duration-300 ${
                index <= currentStep ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`} />
            </div>
          ))}
        </div>
        
        {/* Step indicators with icons and improved design */}
        <div className="hidden md:flex justify-between items-start gap-2">
          {visibleSteps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isAccessible = index <= currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center flex-1 min-w-0">
                <button
                  onClick={() => isAccessible ? goToStep(index) : null}
                  disabled={!isAccessible}
                  className={`group relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 mb-3 ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20 animate-pulse'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <div className={`transition-colors duration-300 ${isCurrent ? 'text-primary-foreground' : 'text-gray-500'}`}>
                      {step.icon}
                    </div>
                  )}
                  
                  {/* Connecting line */}
                  {index < visibleSteps.length - 1 && (
                    <div className={`absolute left-full top-1/2 w-full h-0.5 -translate-y-1/2 transition-colors duration-300 ${
                      index < currentStep ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                    }`} style={{ width: 'calc(100% - 24px)', marginLeft: '12px' }} />
                  )}
                </button>
                
                <div className="text-center">
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                  }`}>
                    {step.shortTitle}
                  </span>
                  {isCompleted && (
                    <div className="flex items-center justify-center mt-1">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Mobile step indicator */}
        <div className="md:hidden flex items-center justify-center gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-colors duration-300 ${
            currentStepData ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'
          }`}>
            <div className="text-primary">
              {currentStepData?.icon}
            </div>
            <span className="font-medium text-primary">
              {currentStepData?.shortTitle}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Navigation buttons component
  const NavigationButtons = () => {
    const isLastStep = currentStep === visibleSteps.length - 1;
    const nextStepData = visibleSteps[currentStep + 1];
    
    return (
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-3 h-auto"
        >
          <ChevronLeft className="w-4 h-4" />
          <div className="text-left">
            <div className="font-medium">Previous</div>
            {currentStep > 0 && (
              <div className="text-xs text-muted-foreground">
                {visibleSteps[currentStep - 1]?.shortTitle}
              </div>
            )}
          </div>
        </Button>
        
        <div className="flex items-center gap-3">
          {/* Progress dots for mobile */}
          <div className="flex md:hidden items-center gap-1">
            {visibleSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index <= currentStep ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          {/* Step validation indicator */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
            canProceed() 
              ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
              : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
          }`}>
            {canProceed() ? (
              <>
                <Check className="w-3 h-3" />
                {getStepMessage()}
              </>
            ) : (
              <>
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                {getStepMessage()}
              </>
            )}
          </div>
        </div>
        
        {isLastStep ? (
          <Button
            onClick={handleLaunch}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 h-auto relative overflow-hidden ${
              canProceed() 
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl' 
                : ''
            }`}
          >
            <div className="text-left">
              <div className="font-medium flex items-center gap-2">
                Launch Pipeline
                <Check className="w-4 h-4" />
              </div>
              <div className="text-xs opacity-90">
                Create your pipeline
              </div>
            </div>
            {canProceed() && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            )}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-3 h-auto"
          >
            <div className="text-right">
              <div className="font-medium">Next</div>
              {nextStepData && (
                <div className="text-xs text-muted-foreground">
                  {nextStepData.shortTitle}
                </div>
              )}
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  };

  // Project types data with icons and styling
  const projectTypes = [
    { 
      id: "nodejs", 
      name: "Node.js", 
      description: "JavaScript/TypeScript projects", 
      icon: <Code className="w-8 h-8" />,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      borderColor: "border-green-200 dark:border-green-800"
    },
    { 
      id: "docker", 
      name: "Docker", 
      description: "Containerized applications", 
      icon: <Package className="w-8 h-8" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    { 
      id: "unity", 
      name: "Unity Game", 
      description: "Unity game development", 
      icon: <Gamepad2 className="w-8 h-8" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    { 
      id: "unreal", 
      name: "Unreal Engine", 
      description: "Unreal Engine projects", 
      icon: <Cpu className="w-8 h-8" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      borderColor: "border-orange-200 dark:border-orange-800"
    },
    { 
      id: "web", 
      name: "Web Application", 
      description: "General web applications", 
      icon: <Globe className="w-8 h-8" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
      borderColor: "border-indigo-200 dark:border-indigo-800"
    },
    { 
      id: "python", 
      name: "Python", 
      description: "Python applications", 
      icon: <FileCode className="w-8 h-8" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      borderColor: "border-yellow-200 dark:border-yellow-800"
    },
    { 
      id: "java", 
      name: "Java", 
      description: "Maven/Gradle projects", 
      icon: <Coffee className="w-8 h-8" />,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
      borderColor: "border-red-200 dark:border-red-800"
    },
    { 
      id: "go", 
      name: "Go", 
      description: "Go module projects", 
      icon: <Terminal className="w-8 h-8" />,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-950",
      borderColor: "border-cyan-200 dark:border-cyan-800"
    },
    { 
      id: "rust", 
      name: "Rust", 
      description: "Cargo-based projects", 
      icon: <Settings className="w-8 h-8" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
      borderColor: "border-amber-200 dark:border-amber-800"
    },
    { 
      id: "mobile", 
      name: "Mobile App", 
      description: "React Native, Flutter, iOS/Android", 
      icon: <Smartphone className="w-8 h-8" />,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950",
      borderColor: "border-pink-200 dark:border-pink-800"
    },
  ];

  // Repository Selection Step
  const RepositoryStep = () => {
    const filterOptions = [
      { id: "all", name: "All Repositories", icon: <FolderOpen className="w-4 h-4" /> },
      { id: "personal", name: "Personal", icon: <Users className="w-4 h-4" /> },
      { id: "organization", name: "Organization", icon: <Users className="w-4 h-4" /> },
      { id: "recent", name: "Recently Updated", icon: <Clock className="w-4 h-4" /> },
    ];

    const sortOptions = [
      { id: "name", name: "Name" },
      { id: "recent", name: "Recently Updated" },
      { id: "owner", name: "Owner" },
    ];

    return (
      <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-primary" />
            {currentStepData.title}
          </CardTitle>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === filter.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {filter.icon}
                    {filter.name}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-background text-sm"
                >
                  {sortOptions.map((sort) => (
                    <option key={sort.id} value={sort.id}>
                      Sort by {sort.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {filteredRepos.length} {filteredRepos.length === 1 ? 'repository' : 'repositories'}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
              {config.repo && (
                <div className="flex items-center gap-1 text-primary">
                  <Check className="w-4 h-4" />
                  Selected: {config.repo.full_name}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty States */}
          {!loading && !error && repos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-semibold mb-2">No repositories found</h3>
              <p className="text-muted-foreground mb-4">
                Make sure you have granted access to your GitHub repositories.
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh Repositories
              </Button>
            </div>
          )}

          {!loading && filteredRepos.length === 0 && repos.length > 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">No matching repositories</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Repository Grid */}
          {!loading && filteredRepos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRepos.map((repo) => {
                const [owner, name] = repo.full_name.split('/');
                const isSelected = config.repo?.id === repo.id;
                
                return (
                  <div 
                    key={repo.id} 
                    className={`group border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' 
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                    onClick={() => handleRepoSelect(repo)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                      }`}>
                        {owner[0].toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold truncate ${isSelected ? 'text-primary' : ''}`}>
                            {name}
                          </h3>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-2">
                          {owner}
                        </p>
                        
                        {/* Repository metadata */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Code className="w-3 h-3" />
                            <span>Public</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            <span>{Math.floor(Math.random() * 100)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-primary/20">
                        <div className="flex items-center gap-2 text-xs text-primary">
                          <Check className="w-3 h-3" />
                          <span className="font-medium">Repository selected</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasNextPage && filteredRepos.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                onClick={loadMoreRepos}
                disabled={loadingMore}
                variant="outline"
                className="px-6"
              >
                {loadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>Loading more...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    Load More Repositories
                  </div>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GitHub App Check - Show after repository is selected */}
      {config.repo && (
        <div className="mt-6">
          <GitHubAppCheck 
            repoFullName={config.repo.full_name}
            onStatusChange={setGithubAppInstalled}
            onLoadingChange={setGithubAppCheckLoading}
          />
        </div>
      )}
    </div>
    );
  };

  // Project Type Step
  const ProjectTypeStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>{currentStepData.title}</CardTitle>
        <p className="text-muted-foreground">{currentStepData.description}</p>
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium">
            📁 Selected repository: <span className="text-primary">{config.repo?.full_name}</span>
          </p>
          {config.projectType && (
            <p className="text-xs text-muted-foreground mt-1">
              Detected: {projectTypes.find(t => t.id === config.projectType)?.name}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectTypes.map((type) => {
            const isSelected = config.projectType === type.id;
            const isDetected = config.projectType === type.id; // You can modify this logic based on detection
            
            return (
              <div
                key={type.id}
                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  isSelected
                    ? `${type.borderColor} ${type.bgColor} shadow-md`
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
                onClick={() => handleProjectTypeChange(type.id)}
              >
                {isDetected && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Detected
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`${isSelected ? type.color : 'text-gray-400'} transition-colors`}>
                    {type.icon}
                  </div>
                  
                  <div>
                    <h3 className={`font-semibold text-lg ${isSelected ? type.color : ''}`}>
                      {type.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                  
                  {isSelected && (
                    <div className={`w-full h-1 ${type.bgColor} rounded-full mt-3`}>
                      <div className={`h-full bg-current ${type.color} rounded-full`}></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Auto-Detection</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                We've analyzed your repository and suggested the most likely project type. You can change this if needed.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Runner Configuration Step
  const RunnerStep = () => {
    const runnerOptions = [
      {
        id: "github-actions",
        name: "GitHub Actions",
        description: "Native GitHub CI/CD platform",
        icon: <Code className="w-6 h-6" />,
        recommended: true,
        features: ["Free for public repos", "Easy setup", "Great integration"]
      },
      {
        id: "jenkins",
        name: "Jenkins",
        description: "Self-hosted automation server",
        icon: <Settings className="w-6 h-6" />,
        recommended: false,
        features: ["Highly customizable", "Self-hosted", "Plugin ecosystem"]
      },
      {
        id: "gitlab-ci",
        name: "GitLab CI",
        description: "GitLab's built-in CI/CD",
        icon: <Terminal className="w-6 h-6" />,
        recommended: false,
        features: ["GitLab integration", "Docker support", "Advanced features"]
      }
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {runnerOptions.map((runner) => {
              const isSelected = config.runner === runner.id;
              
              return (
                <div
                  key={runner.id}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                  onClick={() => handleRunnerChange(runner.id)}
                >
                  {runner.recommended && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Recommended
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`${isSelected ? 'text-primary' : 'text-gray-400'} transition-colors`}>
                        {runner.icon}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isSelected ? 'text-primary' : ''}`}>
                          {runner.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {runner.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {runner.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Storage Configuration Step
  const StorageStep = () => {
    const storageOptions = [
      {
        id: "aws-s3",
        name: "AWS S3",
        description: "Amazon Simple Storage Service",
        icon: <Package className="w-6 h-6" />,
        recommended: true,
        features: ["99.999999999% durability", "Global availability", "Cost-effective"],
        color: "text-orange-600"
      },
      {
        id: "google-cloud-storage",
        name: "Google Cloud Storage",
        description: "Google's object storage service",
        icon: <Globe className="w-6 h-6" />,
        recommended: false,
        features: ["Multi-regional storage", "AI/ML integration", "Strong consistency"],
        color: "text-blue-600"
      },
      {
        id: "azure-blob",
        name: "Azure Blob Storage",
        description: "Microsoft's object storage solution",
        icon: <Cpu className="w-6 h-6" />,
        recommended: false,
        features: ["Hot/Cool/Archive tiers", "Enterprise integration", "Security features"],
        color: "text-indigo-600"
      }
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {storageOptions.map((storage) => {
              const isSelected = config.storage === storage.id;
              
              return (
                <div
                  key={storage.id}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                  onClick={() => handleStorageChange(storage.id)}
                >
                  {storage.recommended && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Recommended
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`${isSelected ? storage.color : 'text-gray-400'} transition-colors`}>
                        {storage.icon}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isSelected ? storage.color : ''}`}>
                          {storage.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {storage.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {storage.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Branches Step
  const BranchesStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>{currentStepData.title}</CardTitle>
        <p className="text-muted-foreground">{currentStepData.description}</p>
      </CardHeader>
      <CardContent>
        {branchesLoading && (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        )}
        {!branchesLoading && !branchesError && branches.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-3xl mb-2">🌿</div>
            <div className="text-sm text-gray-600">No branches found in this repository.</div>
          </div>
        )}
        <div className="space-y-3">
          {branches.map((branch) => (
            <label key={branch} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
              <Checkbox
                checked={config.branches.includes(branch)}
                onCheckedChange={() => handleBranchToggle(branch)}
                id={`branch-${branch}`}
              />
              <span className="font-medium">{branch}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">Select one or more branches to trigger the pipeline on push.</p>
      </CardContent>
    </Card>
  );

  // Unity Configuration Step
  const UnityStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>{currentStepData.title}</CardTitle>
        <p className="text-muted-foreground">{currentStepData.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">License Type</label>
            <select
              value={config.unityLicenseType || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, unityLicenseType: e.target.value as 'personal' | 'professional' }))}
              className="w-full p-3 border rounded-lg bg-background border-gray-200 dark:border-gray-800"
            >
              <option value="">Select license type</option>
              <option value="personal">Personal License</option>
              <option value="professional">Professional License</option>
            </select>
          </div>

          {config.unityLicenseType === 'personal' && (
            <div>
              <label className="block text-sm font-medium mb-2">Unity License File (.ulf)</label>
              <textarea
                placeholder="Paste your Unity license file content here..."
                value={config.unityLicense || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, unityLicense: e.target.value }))}
                className="w-full p-3 border rounded-lg bg-background border-gray-200 dark:border-gray-800 min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Copy the contents of your Unity license file (.ulf) here. This will be stored as a GitHub secret.
              </p>
            </div>
          )}

          {config.unityLicenseType === 'professional' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Unity Email</label>
                <Input
                  type="email"
                  placeholder="your-email@example.com"
                  value={config.unityEmail || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, unityEmail: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unity Password</label>
                <Input
                  type="password"
                  placeholder="Your Unity account password"
                  value={config.unityPassword || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, unityPassword: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unity Serial</label>
                <Input
                  type="text"
                  placeholder="Your Unity Pro serial number"
                  value={config.unitySerial || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, unitySerial: e.target.value }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                These credentials will be stored as GitHub secrets for secure access.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Web Configuration Step
  const WebStep = () => {
    const isNodeJS = config.projectType === 'nodejs';
    const stepTitle = isNodeJS ? 'Node.js Deployment' : 'Web Deployment';
    
    const hostingOptions = isNodeJS ? [
      {
        id: 'vercel',
        name: 'Vercel',
        description: 'Full-stack deployment with serverless functions',
        icon: <Zap className="w-6 h-6" />,
        recommended: true,
        features: ['Serverless functions', 'Edge network', 'Zero config'],
        color: 'text-black',
        bgColor: 'bg-gray-50 dark:bg-gray-950',
        borderColor: 'border-gray-200 dark:border-gray-800'
      },
      {
        id: 'railway',
        name: 'Railway',
        description: 'Modern infrastructure platform for Node.js apps',
        icon: <Terminal className="w-6 h-6" />,
        recommended: true,
        features: ['Git-based deployment', 'Built-in database', 'Auto scaling'],
        color: 'text-violet-600',
        bgColor: 'bg-violet-50 dark:bg-violet-950',
        borderColor: 'border-violet-200 dark:border-violet-800'
      },
      {
        id: 'netlify',
        name: 'Netlify',
        description: 'JAMstack platform with serverless functions',
        icon: <Globe className="w-6 h-6" />,
        recommended: false,
        features: ['Serverless functions', 'Form handling', 'Split testing'],
        color: 'text-teal-600',
        bgColor: 'bg-teal-50 dark:bg-teal-950',
        borderColor: 'border-teal-200 dark:border-teal-800'
      },
      {
        id: 'github-pages',
        name: 'GitHub Pages',
        description: 'Free static site hosting by GitHub',
        icon: <Code className="w-6 h-6" />,
        recommended: false,
        features: ['Free hosting', 'Custom domains', 'Jekyll support'],
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-950',
        borderColor: 'border-purple-200 dark:border-purple-800'
      },
      {
        id: 'render',
        name: 'Render',
        description: 'Cloud platform for apps and static sites',
        icon: <Package className="w-6 h-6" />,
        recommended: false,
        features: ['Managed databases', 'Auto deploys', 'SSL certificates'],
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950',
        borderColor: 'border-emerald-200 dark:border-emerald-800'
      }
    ] : [
      {
        id: 'vercel',
        name: 'Vercel',
        description: 'Optimized for Next.js and static sites',
        icon: <Zap className="w-6 h-6" />,
        recommended: true,
        features: ['Zero config deployment', 'Edge network', 'Preview deployments'],
        color: 'text-black',
        bgColor: 'bg-gray-50 dark:bg-gray-950',
        borderColor: 'border-gray-200 dark:border-gray-800'
      },
      {
        id: 'netlify',
        name: 'Netlify',
        description: 'JAMstack platform with powerful features',
        icon: <Globe className="w-6 h-6" />,
        recommended: false,
        features: ['Form handling', 'Split testing', 'Edge functions'],
        color: 'text-teal-600',
        bgColor: 'bg-teal-50 dark:bg-teal-950',
        borderColor: 'border-teal-200 dark:border-teal-800'
      },
      {
        id: 'github-pages',
        name: 'GitHub Pages',
        description: 'Free static site hosting by GitHub',
        icon: <Code className="w-6 h-6" />,
        recommended: false,
        features: ['Free hosting', 'Custom domains', 'Jekyll support'],
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-950',
        borderColor: 'border-purple-200 dark:border-purple-800'
      }
    ];

    const webFrameworks = [
      { id: 'react', name: 'React' },
      { id: 'vue', name: 'Vue.js' },
      { id: 'angular', name: 'Angular' },
      { id: 'nextjs', name: 'Next.js' },
      { id: 'nuxt', name: 'Nuxt.js' },
      { id: 'vite', name: 'Vite' },
      { id: 'static', name: 'Static HTML' }
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            {currentStepData.title}
          </CardTitle>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Framework Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Web Framework (Optional)</label>
              <select
                value={config.webFramework || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, webFramework: e.target.value }))}
                className="w-full p-3 border rounded-lg bg-background border-gray-200 dark:border-gray-800"
              >
                <option value="">Auto-detect framework</option>
                {webFrameworks.map(framework => (
                  <option key={framework.id} value={framework.id}>{framework.name}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                We'll automatically detect your framework, but you can override it here if needed.
              </p>
            </div>

            {/* Hosting Platform Selection */}
            <div>
              <h4 className="text-sm font-medium mb-3">Hosting Platform</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hostingOptions.map((platform) => {
                  const isSelected = config.hostingPlatform === platform.id;
                  
                  return (
                    <div
                      key={platform.id}
                      className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        isSelected
                          ? `${platform.borderColor} ${platform.bgColor} shadow-md`
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                      }`}
                      onClick={() => setConfig(prev => ({ ...prev, hostingPlatform: platform.id as any }))}
                    >
                      {platform.recommended && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Recommended
                        </div>
                      )}
                      
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`${isSelected ? platform.color : 'text-gray-400'} transition-colors`}>
                            {platform.icon}
                          </div>
                          <div>
                            <h3 className={`font-semibold ${isSelected ? platform.color : ''}`}>
                              {platform.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {platform.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {platform.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform-specific Configuration */}
            {config.hostingPlatform === 'vercel' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium">Vercel Configuration</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Vercel Token</label>
                    <Input
                      type="password"
                      placeholder="Your Vercel API token"
                      value={config.vercelToken || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, vercelToken: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization ID (Optional)</label>
                    <Input
                      type="text"
                      placeholder="Your Vercel team/org ID"
                      value={config.vercelOrgId || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, vercelOrgId: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Project ID (Optional)</label>
                    <Input
                      type="text"
                      placeholder="Your Vercel project ID"
                      value={config.vercelProjectId || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, vercelProjectId: e.target.value }))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get your API token from <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vercel Settings</a>. These will be stored as GitHub secrets.
                  </p>
                </div>
              </div>
            )}

            {config.hostingPlatform === 'netlify' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium">Netlify Configuration</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Netlify Auth Token</label>
                    <Input
                      type="password"
                      placeholder="Your Netlify personal access token"
                      value={config.netlifyAuthToken || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, netlifyAuthToken: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Site ID (Optional)</label>
                    <Input
                      type="text"
                      placeholder="Your Netlify site ID"
                      value={config.netlifySiteId || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, netlifySiteId: e.target.value }))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generate a personal access token in <a href="https://app.netlify.com/user/applications" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Netlify Settings</a>. These will be stored as GitHub secrets.
                  </p>
                </div>
              </div>
            )}

            {config.hostingPlatform === 'github-pages' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium">GitHub Pages Configuration</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Custom Domain (Optional)</label>
                    <Input
                      type="text"
                      placeholder="example.com"
                      value={config.customDomain || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, customDomain: e.target.value }))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    GitHub Pages uses your repository's GITHUB_TOKEN automatically. No additional credentials needed.
                  </p>
                </div>
              </div>
            )}

            {config.hostingPlatform === 'railway' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium">Railway Configuration</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Railway Token</label>
                    <Input
                      type="password"
                      placeholder="Your Railway API token"
                      value={config.railwayToken || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, railwayToken: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Service ID (Optional)</label>
                    <Input
                      type="text"
                      placeholder="Your Railway service ID"
                      value={config.railwayServiceId || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, railwayServiceId: e.target.value }))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get your API token from <a href="https://railway.app/account/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Railway Settings</a>. These will be stored as GitHub secrets.
                  </p>
                </div>
              </div>
            )}

            {config.hostingPlatform === 'render' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium">Render Configuration</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Render API Key</label>
                    <Input
                      type="password"
                      placeholder="Your Render API key"
                      value={config.renderApiKey || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, renderApiKey: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Service ID (Optional)</label>
                    <Input
                      type="text"
                      placeholder="Your Render service ID"
                      value={config.renderServiceId || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, renderServiceId: e.target.value }))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generate an API key in <a href="https://dashboard.render.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Render Dashboard</a>. These will be stored as GitHub secrets.
                  </p>
                </div>
              </div>
            )}

            {/* Environment Variables */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Environment Variables (Optional)</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newEnvVars = { ...(config.environmentVariables || {}), '': '' };
                    setConfig(prev => ({ ...prev, environmentVariables: newEnvVars }));
                  }}
                >
                  Add Variable
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(config.environmentVariables || {}).map(([key, value], index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Variable name"
                      value={key}
                      onChange={(e) => {
                        const newEnvVars = { ...config.environmentVariables };
                        delete newEnvVars[key];
                        newEnvVars[e.target.value] = value;
                        setConfig(prev => ({ ...prev, environmentVariables: newEnvVars }));
                      }}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Variable value"
                      value={value}
                      onChange={(e) => {
                        const newEnvVars = { ...config.environmentVariables };
                        newEnvVars[key] = e.target.value;
                        setConfig(prev => ({ ...prev, environmentVariables: newEnvVars }));
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newEnvVars = { ...config.environmentVariables };
                        delete newEnvVars[key];
                        setConfig(prev => ({ ...prev, environmentVariables: newEnvVars }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                These environment variables will be available during the build process.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Mobile Configuration Step
  const MobileStep = () => {
    const mobileFrameworkOptions = [
      {
        id: 'react-native',
        name: 'React Native',
        description: 'Cross-platform mobile development with React',
        icon: <Code className="w-6 h-6" />,
        platforms: ['ios', 'android']
      },
      {
        id: 'flutter',
        name: 'Flutter',
        description: 'Google\'s UI toolkit for mobile',
        icon: <Code className="w-6 h-6" />,
        platforms: ['ios', 'android']
      },
      {
        id: 'ios-native',
        name: 'iOS Native',
        description: 'Native iOS development with Swift/Objective-C',
        icon: <Smartphone className="w-6 h-6" />,
        platforms: ['ios']
      },
      {
        id: 'android-native',
        name: 'Android Native',
        description: 'Native Android development with Java/Kotlin',
        icon: <Smartphone className="w-6 h-6" />,
        platforms: ['android']
      },
      {
        id: 'xamarin',
        name: 'Xamarin',
        description: 'Microsoft\'s cross-platform mobile framework',
        icon: <Code className="w-6 h-6" />,
        platforms: ['ios', 'android']
      },
      {
        id: 'ionic',
        name: 'Ionic',
        description: 'Hybrid mobile apps with web technologies',
        icon: <Globe className="w-6 h-6" />,
        platforms: ['ios', 'android']
      }
    ];

    const buildVariants = [
      { id: 'debug', name: 'Debug', description: 'Development build with debugging symbols' },
      { id: 'release', name: 'Release', description: 'Optimized production build' }
    ];

    const distributionPlatforms = [
      { id: 'app-store', name: 'App Store', description: 'Distribute via Apple App Store', platform: 'ios' },
      { id: 'play-store', name: 'Google Play', description: 'Distribute via Google Play Store', platform: 'android' },
      { id: 'firebase-distribution', name: 'Firebase Distribution', description: 'Distribute to testers via Firebase', platform: 'both' },
      { id: 'testflight', name: 'TestFlight', description: 'Beta testing via Apple TestFlight', platform: 'ios' },
      { id: 'internal', name: 'Internal', description: 'Internal distribution only', platform: 'both' }
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mobile Framework Selection */}
          <div>
            <h4 className="font-medium mb-3">Mobile Framework</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mobileFrameworkOptions.map((framework) => {
                const isSelected = config.mobileFramework === framework.id;
                return (
                  <div
                    key={framework.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                    }`}
                    onClick={() => setConfig(prev => ({ 
                      ...prev, 
                      mobileFramework: framework.id as any,
                      targetPlatforms: framework.platforms as any
                    }))}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-primary">
                        {framework.icon}
                      </div>
                      <h5 className="font-medium">{framework.name}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {framework.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {framework.platforms.map(platform => (
                        <span key={platform} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                          {platform === 'ios' ? 'iOS' : 'Android'}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target Platforms */}
          {config.mobileFramework && (
            <div>
              <h4 className="font-medium mb-3">Target Platforms</h4>
              <div className="flex gap-4">
                {['ios', 'android'].map((platform) => {
                  const selectedFramework = mobileFrameworkOptions.find(f => f.id === config.mobileFramework);
                  const isSupported = selectedFramework?.platforms.includes(platform as any);
                  const isSelected = config.targetPlatforms?.includes(platform as any);
                  
                  if (!isSupported) return null;
                  
                  return (
                    <div
                      key={platform}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'
                      }`}
                      onClick={() => {
                        const currentPlatforms = config.targetPlatforms || [];
                        const newPlatforms = isSelected
                          ? currentPlatforms.filter(p => p !== platform)
                          : [...currentPlatforms, platform as any];
                        setConfig(prev => ({ ...prev, targetPlatforms: newPlatforms }));
                      }}
                    >
                      <Checkbox checked={isSelected} />
                      <span className="capitalize font-medium">{platform === 'ios' ? 'iOS' : 'Android'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Build Variant */}
          <div>
            <h4 className="font-medium mb-3">Build Variant</h4>
            <div className="grid grid-cols-2 gap-4">
              {buildVariants.map((variant) => {
                const isSelected = config.buildVariant === variant.id;
                return (
                  <div
                    key={variant.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                    }`}
                    onClick={() => setConfig(prev => ({ ...prev, buildVariant: variant.id as any }))}
                  >
                    <h5 className="font-medium mb-1">{variant.name}</h5>
                    <p className="text-sm text-muted-foreground">{variant.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Distribution Platforms */}
          {config.targetPlatforms && config.targetPlatforms.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Distribution Platforms</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {distributionPlatforms
                  .filter(dist => 
                    dist.platform === 'both' || 
                    config.targetPlatforms?.includes(dist.platform as any)
                  )
                  .map((platform) => {
                    const isSelected = config.distributionPlatforms?.includes(platform.id as any);
                    return (
                      <div
                        key={platform.id}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'
                        }`}
                        onClick={() => {
                          const current = config.distributionPlatforms || [];
                          const newDistributions = isSelected
                            ? current.filter(p => p !== platform.id)
                            : [...current, platform.id as any];
                          setConfig(prev => ({ ...prev, distributionPlatforms: newDistributions }));
                        }}
                      >
                        <Checkbox checked={isSelected} />
                        <div>
                          <h5 className="font-medium">{platform.name}</h5>
                          <p className="text-sm text-muted-foreground">{platform.description}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-blue-900 dark:text-blue-100">Mobile App Deployment</h5>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Mobile apps require additional setup for app store deployment. You'll need to configure signing certificates, 
                  app store credentials, and other platform-specific settings via GitHub Secrets after the pipeline is created.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Review Step
  const ReviewStep = () => {
    const [showFullWorkflow, setShowFullWorkflow] = useState(false);
    const workflowContent = generateWorkflowPreview();
    
    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      } catch {
        toast.error('Failed to copy to clipboard');
      }
    };

    return (
      <div className="space-y-6">
        {/* Configuration Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              {currentStepData.title}
            </CardTitle>
            <p className="text-muted-foreground">{currentStepData.description}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Repository Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Repository</h4>
                    <p className="text-sm text-muted-foreground">{config.repo?.full_name}</p>
                  </div>
                </div>
              </div>

              {/* Project Type Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  {projectTypes.find(t => t.id === config.projectType)?.icon && (
                    <div className="text-primary">
                      {projectTypes.find(t => t.id === config.projectType)?.icon}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">Project Type</h4>
                    <p className="text-sm text-muted-foreground">
                      {projectTypes.find(t => t.id === config.projectType)?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Runner Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Cog className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Runner</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {config.runner.replace('-', ' ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Storage Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Database className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Storage</h4>
                    <p className="text-sm text-muted-foreground">
                      {config.storage === 'aws-s3' ? 'AWS S3' : 
                       config.storage === 'google-cloud-storage' ? 'Google Cloud Storage' :
                       config.storage === 'azure-blob' ? 'Azure Blob Storage' : config.storage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Branches Section */}
              <div className="md:col-span-2">
                <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                  <GitBranch className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">Trigger Branches</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {config.branches.map((branch) => (
                        <span
                          key={branch}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs font-mono rounded-md"
                        >
                          {branch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Unity Configuration */}
              {config.projectType === 'unity' && config.unityLicenseType && (
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Unity Configuration</h4>
                      <p className="text-sm text-muted-foreground">
                        {config.unityLicenseType === 'personal' ? 'Personal License' : 'Professional License'}
                        {isStepComplete('unity') && (
                          <span className="ml-2 text-green-600">✓ Configured</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Workflow Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Generated Workflow
            </CardTitle>
            <p className="text-muted-foreground">
              Preview of the GitHub Actions workflow that will be created
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Workflow Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h5 className="font-medium text-green-900 dark:text-green-100">Triggers</h5>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {config.branches.length} branch{config.branches.length !== 1 ? 'es' : ''} + PRs
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Layers className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-medium text-blue-900 dark:text-blue-100">Jobs</h5>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Build & Test
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h5 className="font-medium text-purple-900 dark:text-purple-100">Runtime</h5>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    ~{config.projectType === 'docker' ? '3-5' : config.projectType === 'unity' ? '15-25' : '2-4'} min
                  </p>
                </div>
              </div>

              {/* Workflow Steps Preview */}
              <div className="space-y-3">
                <h5 className="font-medium">Pipeline Steps:</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Checkout Repository</p>
                      <p className="text-sm text-muted-foreground">Download source code from {config.repo?.full_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Setup Environment</p>
                      <p className="text-sm text-muted-foreground">
                        Configure {config.projectType === 'nodejs' ? 'Node.js' : 
                                 config.projectType === 'python' ? 'Python' :
                                 config.projectType === 'unity' ? 'Unity' : config.projectType} environment
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Build & Test</p>
                      <p className="text-sm text-muted-foreground">Compile code and run automated tests</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Deploy Artifacts</p>
                      <p className="text-sm text-muted-foreground">
                        Upload build artifacts to {config.storage === 'aws-s3' ? 'AWS S3' : config.storage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Workflow YAML */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium">Full Workflow File</h5>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(workflowContent)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy YAML
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFullWorkflow(!showFullWorkflow)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      {showFullWorkflow ? 'Hide' : 'Show'} Code
                    </Button>
                  </div>
                </div>

                {showFullWorkflow && (
                  <div className="relative">
                    <pre className="text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border overflow-x-auto max-h-96 overflow-y-auto">
                      <code>{workflowContent}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Launch Confirmation */}
        <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Ready to Launch Pipeline
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  Your pipeline configuration is complete. Click the launch button below to create the GitHub Actions workflow in your repository.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <FileText className="w-4 h-4" />
                  <span>File will be created: <code className="font-mono">.github/workflows/{config.projectType}-pipeline.yml</code></span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStepData?.id) {
      case 'repo':
        return <RepositoryStep />;
      case 'project':
        return <ProjectTypeStep />;
      case 'runner':
        return <RunnerStep />;
      case 'storage':
        return <StorageStep />;
      case 'branches':
        return <BranchesStep />;
      case 'unity':
        return <UnityStep />;
      case 'web':
        return <WebStep />;
      case 'mobile':
        return <MobileStep />;
      case 'review':
        return <ReviewStep />;
      default:
        return null;
    }
  };

  // Configuration Preview Sidebar
  const ConfigurationPreview = () => {
    const [showWorkflow, setShowWorkflow] = useState(false);
    const workflowContent = generateWorkflowPreview();
    
    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      } catch {
        toast.error('Failed to copy to clipboard');
      }
    };

    return (
      <div className="w-80 flex-shrink-0">
        <div className="sticky top-4 space-y-4">
          {/* Configuration Summary */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-5 h-5 text-primary" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Repository</span>
                  {config.repo ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full" />
                  )}
                </div>
                {config.repo && (
                  <div className="text-sm font-medium truncate" title={config.repo.full_name}>
                    {config.repo.full_name}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Project Type</span>
                  {config.projectType ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full" />
                  )}
                </div>
                {config.projectType && (
                  <div className="flex items-center gap-2">
                    <div className="text-primary">
                      {projectTypes.find(t => t.id === config.projectType)?.icon}
                    </div>
                    <span className="text-sm font-medium">
                      {projectTypes.find(t => t.id === config.projectType)?.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Runner</span>
                  {config.runner ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full" />
                  )}
                </div>
                {config.runner && (
                  <div className="text-sm font-medium capitalize">
                    {config.runner.replace('-', ' ')}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Storage</span>
                  {config.storage ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full" />
                  )}
                </div>
                {config.storage && (
                  <div className="text-sm font-medium">
                    {config.storage === 'aws-s3' ? 'AWS S3' : 
                     config.storage === 'google-cloud-storage' ? 'Google Cloud Storage' :
                     config.storage === 'azure-blob' ? 'Azure Blob Storage' : config.storage}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Branches</span>
                  {config.branches.length > 0 ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full" />
                  )}
                </div>
                {config.branches.length > 0 && (
                  <div className="space-y-1">
                    {config.branches.slice(0, 3).map((branch) => (
                      <div key={branch} className="flex items-center gap-2 text-sm">
                        <GitBranch className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono text-xs">{branch}</span>
                      </div>
                    ))}
                    {config.branches.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{config.branches.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>

              {config.projectType === 'unity' && config.unityLicenseType && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Unity License</span>
                    {isStepComplete('unity') ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border border-gray-300 rounded-full" />
                    )}
                  </div>
                  <div className="text-sm font-medium capitalize">
                    {config.unityLicenseType} License
                  </div>
                </div>
              )}

              {['web', 'nodejs'].includes(config.projectType) && config.hostingPlatform && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {config.projectType === 'nodejs' ? 'Deployment' : 'Hosting'}
                    </span>
                    {isStepComplete('web') ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border border-gray-300 rounded-full" />
                    )}
                  </div>
                  <div className="text-sm font-medium">
                    {config.hostingPlatform === 'vercel' ? 'Vercel' :
                     config.hostingPlatform === 'netlify' ? 'Netlify' :
                     config.hostingPlatform === 'railway' ? 'Railway' :
                     config.hostingPlatform === 'render' ? 'Render' :
                     config.hostingPlatform === 'github-pages' ? 'GitHub Pages' : config.hostingPlatform}
                  </div>
                  {config.webFramework && (
                    <div className="text-xs text-muted-foreground">
                      Framework: {config.webFramework}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workflow Preview */}
          {config.projectType && (
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-5 h-5 text-primary" />
                  Workflow Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Play className="w-4 h-4" />
                    <span>
                      {config.projectType.toUpperCase()} CI/CD Pipeline
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Triggers:</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span>Push to {config.branches.length > 0 ? config.branches.join(', ') : 'main'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <GitBranch className="w-3 h-3 text-blue-500" />
                        <span>Pull requests to main</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Settings className="w-3 h-3 text-gray-500" />
                        <span>Manual trigger</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Jobs:</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Layers className="w-3 h-3 text-green-500" />
                        <span>Build & Test</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Package className="w-3 h-3 text-blue-500" />
                        <span>Create Artifacts</span>
                      </div>
                      {config.storage && (
                        <div className="flex items-center gap-2 text-xs">
                          <Database className="w-3 h-3 text-purple-500" />
                          <span>Deploy to {config.storage === 'aws-s3' ? 'S3' : config.storage}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowWorkflow(!showWorkflow)}
                      className="w-full text-xs"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      {showWorkflow ? 'Hide' : 'View'} YAML
                    </Button>
                    
                    {showWorkflow && (
                      <div className="space-y-2">
                        <div className="relative">
                          <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border overflow-x-auto max-h-40 overflow-y-auto">
                            <code>{workflowContent}</code>
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(workflowContent)}
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pipeline Estimation */}
          {config.projectType && (
            <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-100">
                    <BarChart3 className="w-4 h-4" />
                    Estimated Runtime
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ~{config.projectType === 'docker' ? '3-5' : config.projectType === 'unity' ? '15-25' : '2-4'} min
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    Based on {config.projectType} project type
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="max-w-7xl mx-auto py-10 px-4">
      <ProgressIndicator />
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          {renderCurrentStep()}
          <NavigationButtons />
        </div>
        <ConfigurationPreview />
      </div>
    </main>
  );
}
