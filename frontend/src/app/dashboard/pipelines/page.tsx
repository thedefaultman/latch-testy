"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  GitBranch,
  ExternalLink,
  Settings,
  Trash2,
  Eye,
  MoreHorizontal,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Download
} from "lucide-react";

interface Pipeline {
  id: string;
  name: string;
  repoName: string;
  projectType: string;
  status: "success" | "failed" | "running" | "pending";
  createdAt: string;
  lastRun: string;
  duration: number;
  successRate: number;
  totalRuns: number;
  branches: string[];
  workflowUrl?: string;
  description?: string;
}

interface ApiPipeline {
  id: string;
  repoName: string;
  projectType: string;
  status: string;
  workflowStatus?: string;
  createdAt: string;
  workflowUrl?: string;
  latestRunId?: number;
  latestRunUrl?: string;
  latestRunAt?: string;
}


export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pipelineToDelete, setPipelineToDelete] = useState<Pipeline | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data for development
  const mockPipelines: Pipeline[] = [
    {
      id: "1",
      name: "Frontend Deploy",
      repoName: "acme/frontend-app",
      projectType: "nodejs",
      status: "success",
      createdAt: "2024-01-15T10:00:00Z",
      lastRun: "2 minutes ago",
      duration: 245,
      successRate: 94.2,
      totalRuns: 156,
      branches: ["main", "develop"],
      workflowUrl: "https://github.com/acme/frontend-app/actions",
      description: "Production deployment pipeline for the main frontend application"
    },
    {
      id: "2", 
      name: "API Backend",
      repoName: "acme/api-service",
      projectType: "docker",
      status: "running",
      createdAt: "2024-01-10T14:30:00Z",
      lastRun: "Running now",
      duration: 180,
      successRate: 98.1,
      totalRuns: 89,
      branches: ["main"],
      workflowUrl: "https://github.com/acme/api-service/actions",
      description: "Backend API deployment and testing pipeline"
    },
    {
      id: "3",
      name: "Mobile Game Build",
      repoName: "acme/unity-game",
      projectType: "unity",
      status: "failed",
      createdAt: "2024-01-20T09:15:00Z",
      lastRun: "1 hour ago",
      duration: 1240,
      successRate: 87.3,
      totalRuns: 34,
      branches: ["main", "release"],
      workflowUrl: "https://github.com/acme/unity-game/actions",
      description: "Unity game build pipeline for iOS and Android platforms"
    },
    {
      id: "4",
      name: "Data Pipeline",
      repoName: "acme/etl-scripts",
      projectType: "python",
      status: "success",
      createdAt: "2024-01-05T16:45:00Z",
      lastRun: "3 hours ago", 
      duration: 156,
      successRate: 96.8,
      totalRuns: 67,
      branches: ["main"],
      workflowUrl: "https://github.com/acme/etl-scripts/actions",
      description: "Data processing and ETL pipeline for analytics"
    },
    {
      id: "5",
      name: "Documentation Site",
      repoName: "acme/docs-site",
      projectType: "web",
      status: "pending",
      createdAt: "2024-01-25T11:20:00Z",
      lastRun: "6 hours ago",
      duration: 89,
      successRate: 99.1,
      totalRuns: 23,
      branches: ["main", "staging"],
      workflowUrl: "https://github.com/acme/docs-site/actions",
      description: "Documentation website deployment pipeline"
    },
    {
      id: "6",
      name: "Microservice Auth",
      repoName: "acme/auth-service",
      projectType: "nodejs",
      status: "success",
      createdAt: "2024-01-12T13:10:00Z",
      lastRun: "12 hours ago",
      duration: 134,
      successRate: 95.7,
      totalRuns: 78,
      branches: ["main", "develop"],
      workflowUrl: "https://github.com/acme/auth-service/actions",
      description: "Authentication microservice deployment"
    }
  ];

  // Transform API status to our status type
  const mapApiStatus = (apiStatus: string): "success" | "failed" | "running" | "pending" => {
    switch (apiStatus.toLowerCase()) {
      case "active":
      case "success":
      case "completed":
        return "success";
      case "failed":
      case "failure":
      case "error":
        return "failed";
      case "running":
      case "in_progress":
      case "queued":
        return "running";
      case "pending":
      case "waiting":
        return "pending";
      default:
        return "pending";
    }
  };

  // Transform real API data to match our interface
  const transformApiPipeline = (apiPipeline: ApiPipeline): Pipeline => ({
    id: apiPipeline.id,
    name: apiPipeline.repoName.split('/').pop() || apiPipeline.repoName, // Use repo name as pipeline name
    repoName: apiPipeline.repoName,
    projectType: apiPipeline.projectType,
    status: mapApiStatus(apiPipeline.workflowStatus || apiPipeline.status), // Use workflow status if available
    createdAt: apiPipeline.createdAt,
    lastRun: apiPipeline.latestRunAt 
      ? new Date(apiPipeline.latestRunAt).toLocaleDateString() 
      : new Date(apiPipeline.createdAt).toLocaleDateString(),
    duration: Math.floor(Math.random() * 300) + 60, // Mock duration
    successRate: Math.floor(Math.random() * 20) + 80, // Mock success rate
    totalRuns: Math.floor(Math.random() * 100) + 10, // Mock total runs
    branches: ["main"], // Mock branches
    workflowUrl: apiPipeline.latestRunUrl || apiPipeline.workflowUrl, // Use latest run URL if available
    description: `${apiPipeline.projectType} pipeline for ${apiPipeline.repoName}`
  });

  useEffect(() => {
    setLoading(true);
    // Fetch real data from API
    fetch("/api/pipelines")
      .then((res) => res.json())
      .then((data) => {
        const transformedPipelines = data.map(transformApiPipeline);
        setPipelines(transformedPipelines);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch pipelines:", error);
        // Fallback to mock data if API fails
        setPipelines(mockPipelines);
        setLoading(false);
      });
  }, []);


  // Filter and sort pipelines
  const filteredAndSortedPipelines = pipelines
    .filter(pipeline => {
      const matchesSearch = pipeline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pipeline.repoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pipeline.projectType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === "all" || pipeline.status === selectedFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const getValue = (pipeline: Pipeline) => {
        switch (sortBy) {
          case "name": return pipeline.name;
          case "status": return pipeline.status;
          case "lastRun": return pipeline.lastRun;
          case "successRate": return pipeline.successRate;
          case "duration": return pipeline.duration;
          default: return pipeline.name;
        }
      };
      
      const aVal = getValue(a);
      const bVal = getValue(b);
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      running: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status}
      </Badge>
    );
  };

  // Project type icon component
  const ProjectIcon = ({ type }: { type: string }) => {
    const icons = {
      nodejs: '🟢',
      docker: '🐳', 
      unity: '🎮',
      python: '🐍',
      web: '🌐'
    };
    return <span className="text-lg">{icons[type as keyof typeof icons] || '📦'}</span>;
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = async () => {
    if (!pipelineToDelete) return;
    try {
      const res = await fetch(`/api/pipelines/${pipelineToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Pipeline deleted successfully!');
        setPipelines(pipelines.filter(p => p.id !== pipelineToDelete.id));
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Failed to delete pipeline');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setDeleteDialogOpen(false);
      setPipelineToDelete(null);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                My Pipelines
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and monitor your CI/CD pipelines
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Link href="/dashboard/new">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Pipeline
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search pipelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="running">Running</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
              <option value="lastRun">Sort by Last Run</option>
              <option value="successRate">Sort by Success Rate</option>
              <option value="duration">Sort by Duration</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Pipelines Grid/List */}
        {filteredAndSortedPipelines.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground text-6xl mb-6">🚀</div>
            <h3 className="text-2xl font-semibold mb-3">
              {pipelines.length === 0 ? "No pipelines yet" : "No matching pipelines"}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {pipelines.length === 0 
                ? "Create your first CI/CD pipeline to get started with automated deployments"
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {pipelines.length === 0 && (
              <Link href="/dashboard/new">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Pipeline
                </Button>
              </Link>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPipelines.map((pipeline) => (
              <Card key={pipeline.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <ProjectIcon type={pipeline.projectType} />
                      <div>
                        <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{pipeline.repoName}</p>
                      </div>
                    </div>
                    <StatusBadge status={pipeline.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pipeline.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Success Rate</p>
                        <p className="font-medium">{pipeline.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Duration</p>
                        <p className="font-medium">{pipeline.duration}s</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Runs</p>
                        <p className="font-medium">{pipeline.totalRuns}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Run</p>
                        <p className="font-medium">{pipeline.lastRun}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <GitBranch className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {pipeline.branches.join(", ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-3">
                      <Link href={`/dashboard/pipelines/${pipeline.id}`}>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </Link>
                      {pipeline.workflowUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={pipeline.workflowUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedPipelines.map((pipeline) => (
              <Card key={pipeline.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <ProjectIcon type={pipeline.projectType} />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{pipeline.name}</h3>
                        <p className="text-sm text-muted-foreground">{pipeline.repoName}</p>
                        <p className="text-xs text-muted-foreground mt-1">{pipeline.description}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-8 text-center">
                        <div>
                          <p className="text-sm font-medium">{pipeline.successRate}%</p>
                          <p className="text-xs text-muted-foreground">Success</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{pipeline.duration}s</p>
                          <p className="text-xs text-muted-foreground">Duration</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{pipeline.totalRuns}</p>
                          <p className="text-xs text-muted-foreground">Runs</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{pipeline.lastRun}</p>
                          <p className="text-xs text-muted-foreground">Last Run</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={pipeline.status} />
                      <div className="flex gap-1">
                        <Link href={`/dashboard/pipelines/${pipeline.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </Link>
                        {pipeline.workflowUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={pipeline.workflowUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => { setPipelineToDelete(pipeline); setDeleteDialogOpen(true); }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pipeline</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete the pipeline <span className="font-semibold">{pipelineToDelete?.name}</span>? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 