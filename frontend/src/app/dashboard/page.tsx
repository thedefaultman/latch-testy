"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, 
  CheckCircle2, 
  Timer, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  RotateCcw,
  GitBranch,
  Clock,
  Calendar,
  Zap,
  Eye,
  MoreHorizontal,
  ExternalLink,
  Download,
  Settings
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mock data types
interface Pipeline {
  id: string;
  name: string;
  repository: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  lastRun: string;
  duration: number;
  successRate: number;
  totalRuns: number;
  projectType: string;
  branches: string[];
}

interface RecentActivity {
  id: string;
  pipeline: string;
  status: 'success' | 'failed' | 'running';
  duration: number;
  timestamp: string;
  branch: string;
  commit: string;
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("7d");
  // Comprehensive mock data
  const mockPipelines: Pipeline[] = [
    {
      id: "1",
      name: "Frontend Deploy",
      repository: "acme/frontend-app",
      status: "success",
      lastRun: "2 minutes ago",
      duration: 245,
      successRate: 94.2,
      totalRuns: 156,
      projectType: "nodejs",
      branches: ["main", "develop"]
    },
    {
      id: "2", 
      name: "API Backend",
      repository: "acme/api-service",
      status: "running",
      lastRun: "Running now",
      duration: 180,
      successRate: 98.1,
      totalRuns: 89,
      projectType: "docker",
      branches: ["main"]
    },
    {
      id: "3",
      name: "Mobile Game Build",
      repository: "acme/unity-game",
      status: "failed",
      lastRun: "1 hour ago",
      duration: 1240,
      successRate: 87.3,
      totalRuns: 34,
      projectType: "unity",
      branches: ["main", "release"]
    },
    {
      id: "4",
      name: "Data Pipeline",
      repository: "acme/etl-scripts",
      status: "success",
      lastRun: "3 hours ago", 
      duration: 156,
      successRate: 96.8,
      totalRuns: 67,
      projectType: "python",
      branches: ["main"]
    },
    {
      id: "5",
      name: "Documentation Site",
      repository: "acme/docs-site",
      status: "pending",
      lastRun: "6 hours ago",
      duration: 89,
      successRate: 99.1,
      totalRuns: 23,
      projectType: "web",
      branches: ["main", "staging"]
    }
  ];

  const mockActivity: RecentActivity[] = [
    {
      id: "1",
      pipeline: "Frontend Deploy",
      status: "success",
      duration: 245,
      timestamp: "2 min ago",
      branch: "main",
      commit: "a1b2c3d"
    },
    {
      id: "2",
      pipeline: "API Backend", 
      status: "running",
      duration: 0,
      timestamp: "5 min ago",
      branch: "develop",
      commit: "e4f5g6h"
    },
    {
      id: "3",
      pipeline: "Mobile Game Build",
      status: "failed",
      duration: 1240,
      timestamp: "1 hour ago",
      branch: "main",
      commit: "i7j8k9l"
    },
    {
      id: "4",
      pipeline: "Data Pipeline",
      status: "success",
      duration: 156,
      timestamp: "3 hours ago",
      branch: "main", 
      commit: "m1n2o3p"
    },
    {
      id: "5",
      pipeline: "Documentation Site",
      status: "success",
      duration: 89,
      timestamp: "6 hours ago",
      branch: "staging",
      commit: "q4r5s6t"
    }
  ];

  // Overall metrics derived from mock data
  const totalRuns = mockPipelines.reduce((sum, p) => sum + p.totalRuns, 0);
  const avgSuccessRate = mockPipelines.reduce((sum, p) => sum + p.successRate, 0) / mockPipelines.length;
  const avgDuration = mockPipelines.reduce((sum, p) => sum + p.duration, 0) / mockPipelines.length;
  const activePipelines = mockPipelines.length;
  const runningPipelines = mockPipelines.filter(p => p.status === 'running').length;

  // Filter pipelines based on search and status
  const filteredPipelines = mockPipelines.filter(pipeline => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pipeline.repository.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || pipeline.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Chart data for pipeline runs over time
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Pipeline Runs',
        data: [12, 19, 8, 15, 22, 14, 18],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: '#e5e7eb' } },
    },
  };

  // Success rate donut chart
  const successData = {
    labels: ['Success', 'Failed'],
    datasets: [
      {
        data: [Math.round(avgSuccessRate), 100 - Math.round(avgSuccessRate)],
        backgroundColor: [
          '#22c55e',
          '#ef4444'
        ],
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Pipeline Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor and manage your CI/CD pipelines
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
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Pipeline
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Pipelines</p>
                  <p className="text-3xl font-bold">{activePipelines}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +2 this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +1.2% vs last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                  <p className="text-3xl font-bold">{Math.round(avgDuration)}s</p>
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3" />
                    +15s vs last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Timer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Runs</p>
                  <p className="text-3xl font-bold">{totalRuns}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +23 this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pipeline Activity Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pipeline Activity</CardTitle>
                <select 
                  className="text-sm border rounded px-2 py-1 bg-background"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Success Rate Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <Doughnut data={successData} options={donutOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold" style={{color: '#22c55e'}}>{Math.round(avgSuccessRate)}%</span>
                    <span className="text-xs text-muted-foreground">Success</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#22c55e'}} />
                  <span className="text-sm">Success</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#ef4444'}} />
                  <span className="text-sm">Failed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipelines and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipelines List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pipelines</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search pipelines..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-8 w-64"
                    />
                  </div>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="text-sm border rounded px-2 py-1 h-8 bg-background"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="running">Running</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPipelines.map((pipeline) => (
                  <div key={pipeline.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <ProjectIcon type={pipeline.projectType} />
                      <div>
                        <h4 className="font-medium">{pipeline.name}</h4>
                        <p className="text-sm text-muted-foreground">{pipeline.repository}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{pipeline.successRate}% success</p>
                        <p className="text-xs text-muted-foreground">{pipeline.totalRuns} runs</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{pipeline.lastRun}</p>
                        <p className="text-xs text-muted-foreground">{pipeline.duration}s avg</p>
                      </div>
                      <StatusBadge status={pipeline.status} />
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {activity.status === 'failed' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      {activity.status === 'running' && <Clock className="w-5 h-5 text-blue-500 animate-spin" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.pipeline}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <GitBranch className="w-3 h-3" />
                        <span>{activity.branch}</span>
                        <span>•</span>
                        <span>{activity.commit}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      {activity.duration > 0 && (
                        <p className="text-xs text-muted-foreground">{activity.duration}s</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
