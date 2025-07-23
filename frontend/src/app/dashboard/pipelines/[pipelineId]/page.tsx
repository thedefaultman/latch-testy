"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  GitBranch,
  Clock,
  Calendar,
  ExternalLink,
  Settings,
  Edit3,
  Save,
  X,
  Download,
  RefreshCw,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Pipeline {
  id: string;
  repoName: string;
  projectType: string;
  status: string;
  createdAt: string;
  yaml?: string;
}

interface WorkflowRun {
  id: number;
  status: string;
  conclusion: string | null;
  created_at: string;
  html_url: string;
  name: string;
  head_branch: string;
  run_number: number;
}

export default function PipelineDetailsPage() {
  const { pipelineId } = useParams();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [yaml, setYaml] = useState("");
  const [loading, setLoading] = useState(true);

  // Past runs state
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [runsLoading, setRunsLoading] = useState(true);
  const [runsError, setRunsError] = useState<string | null>(null);

  // Log viewing state
  const [logRunId, setLogRunId] = useState<number | null>(null);
  const [logDrawerOpen, setLogDrawerOpen] = useState(false);
  const [logs, setLogs] = useState<string>("");
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  // Re-run pipeline state
  const [rerunLoading, setRerunLoading] = useState(false);
  const [yamlLoading, setYamlLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Collapsible logs state
  const [logsExpanded, setLogsExpanded] = useState(true);

  useEffect(() => {
    if (!pipelineId) return;
    setLoading(true);
    fetch(`/api/pipelines/${pipelineId}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to fetch pipeline");
        }
        return res.json();
      })
      .then((data) => {
        setPipeline(data);
        setYaml(data.yaml || "");
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Unknown error");
        setLoading(false);
      });
  }, [pipelineId]);

  // Fetch past runs
  useEffect(() => {
    if (!pipelineId) return;
    setRunsLoading(true);
    setRunsError(null);
    fetch(`/api/pipelines/${pipelineId}/runs`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to fetch workflow runs");
        }
        return res.json();
      })
      .then((data) => {
        setRuns(data.runs || []);
        setRunsLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Unknown error");
        setRunsLoading(false);
      });
  }, [pipelineId]);

  // Fetch logs for a given runId
  const fetchLogs = async (runId: number) => {
    setLogsLoading(true);
    setLogsError(null);
    setLogs("");
    try {
      const res = await fetch(`/api/pipelines/${pipelineId}/logs?runId=${runId}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch logs");
      }
      const data = await res.json();
      setLogs(data.logs || "");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Unknown error");
      } else {
        toast.error("Unknown error");
      }
    } finally {
      setLogsLoading(false);
    }
  };

  // Fetch logs for the latest run on load
  useEffect(() => {
    if (runs && runs.length > 0) {
      fetchLogs(runs[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runs]);

  // Handler for viewing logs for a specific run
  const handleViewLogs = (runId: number) => {
    setLogRunId(runId);
    setLogDrawerOpen(true);
    fetchLogs(runId);
  };

  // Handler for deleting pipeline
  const handleDelete = async () => {
    if (!pipeline) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/pipelines/${pipelineId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete pipeline');
      }
      toast.success('Pipeline deleted successfully!');
      router.push('/dashboard/pipelines');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      running: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
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
    return <span className="text-2xl">{icons[type as keyof typeof icons] || '📦'}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pipeline) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/pipelines">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Pipelines
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <ProjectIcon type={pipeline.projectType} />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                    {pipeline.repoName}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{pipeline.projectType}</span>
                    <span>•</span>
                    <span>Created {new Date(pipeline.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={pipeline.status} />
              <Button 
                variant="outline" 
                size="sm"
                disabled={rerunLoading}
                onClick={async () => {
                  setRerunLoading(true);
                  try {
                    const res = await fetch(`/api/pipelines/${pipelineId}/rerun`, { method: 'POST' });
                    if (!res.ok) {
                      const data = await res.json().catch(() => ({}));
                      throw new Error(data.error || 'Failed to re-run pipeline');
                    }
                    toast.success('Pipeline re-run triggered!');
                    // Refresh runs
                    setRunsLoading(true);
                    fetch(`/api/pipelines/${pipelineId}/runs`)
                      .then(async (res) => {
                        if (!res.ok) {
                          const data = await res.json().catch(() => ({}));
                          throw new Error(data.error || 'Failed to fetch workflow runs');
                        }
                        return res.json();
                      })
                      .then((data) => {
                        setRuns(data.runs || []);
                        setRunsLoading(false);
                      })
                      .catch((err) => {
                        toast.error(err.message || 'Unknown error');
                        setRunsLoading(false);
                      });
                  } catch (err: unknown) {
                    toast.error(err instanceof Error ? err.message : 'Unknown error');
                  } finally {
                    setRerunLoading(false);
                  }
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {rerunLoading ? 'Running...' : 'Re-run'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                disabled={deleteLoading}
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* YAML Config Viewer */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Workflow Configuration</CardTitle>
              </div>
              {editing ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm" 
                    onClick={() => { 
                      setEditing(false); 
                      setYaml(pipeline.yaml || ""); 
                      setYamlLoading(false);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    disabled={yamlLoading}
                    onClick={async () => {
                      setYamlLoading(true);
                      try {
                        const res = await fetch(`/api/pipelines/${pipelineId}/yaml`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ yaml }),
                        });
                        if (!res.ok) {
                          const data = await res.json().catch(() => ({}));
                          throw new Error(data.error || 'Failed to save YAML');
                        }
                        toast.success('YAML saved successfully!');
                        setEditing(false);
                        // Refresh pipeline data to get updated YAML
                        const pipelineRes = await fetch(`/api/pipelines/${pipelineId}`);
                        if (pipelineRes.ok) {
                          const pipelineData = await pipelineRes.json();
                          setPipeline(pipelineData);
                          setYaml(pipelineData.yaml || "");
                        }
                      } catch (err: unknown) {
                        toast.error(err instanceof Error ? err.message : 'Unknown error');
                      } finally {
                        setYamlLoading(false);
                      }
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {yamlLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit YAML
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editing ? (
              <Textarea
                className="font-mono text-sm min-h-[400px] resize-none"
                value={yaml}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setYaml(e.target.value)}
                placeholder="Enter your GitHub Actions workflow YAML here..."
              />
            ) : (
              <div className="rounded-lg overflow-hidden">
                {pipeline.yaml ? (
                  <pre className="bg-muted/50 border rounded-lg p-6 text-sm font-mono overflow-x-auto min-h-[400px] whitespace-pre-wrap text-foreground">
                    {pipeline.yaml}
                  </pre>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No YAML Configuration</h3>
                    <p className="text-muted-foreground mb-6">
                      This pipeline doesn't have a workflow configuration yet.
                    </p>
                    <Button onClick={() => setEditing(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Add Configuration
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Log Viewer (Latest Run) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Latest Run Logs</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLogsExpanded(!logsExpanded)}
                  className="ml-2"
                >
                  {logsExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => runs && runs.length > 0 && fetchLogs(runs[0].id)}
                disabled={logsLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${logsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          {logsExpanded && (
            <CardContent>
              <div className="rounded-lg overflow-hidden">
                {logsLoading ? (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading logs...</p>
                  </div>
                ) : logsError ? (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-700 dark:text-red-400">{logsError}</p>
                  </div>
                ) : logs ? (
                  <div className="max-h-96 overflow-y-auto">
                    {typeof logs === 'object' ? (
                      Object.entries(logs).map(([file, content]) => (
                        <div key={file} className="mb-4 last:mb-0">
                          <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
                            {file}
                          </div>
                          <pre className="bg-muted/50 border rounded-lg p-4 text-xs font-mono whitespace-pre-wrap break-all overflow-x-auto text-foreground">
                            {content as string}
                          </pre>
                        </div>
                      ))
                    ) : (
                      <pre className="bg-muted/50 border rounded-lg p-6 text-sm font-mono overflow-x-auto whitespace-pre-wrap text-foreground">
                        {logs}
                      </pre>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Logs Available</h3>
                    <p className="text-muted-foreground">
                      Logs will appear here once the pipeline runs.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Workflow Runs */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Workflow Runs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {runsLoading ? (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading workflow runs...</p>
              </div>
            ) : runsError ? (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-700 dark:text-red-400">{runsError}</p>
              </div>
            ) : runs.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Workflow Runs</h3>
                <p className="text-muted-foreground mb-6">
                  Workflow runs will appear here once the pipeline is triggered.
                </p>
                <Button 
                  disabled={rerunLoading}
                  onClick={async () => {
                    setRerunLoading(true);
                    try {
                      const res = await fetch(`/api/pipelines/${pipelineId}/rerun`, { method: 'POST' });
                      if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.error || 'Failed to re-run pipeline');
                      }
                      toast.success('Pipeline run triggered!');
                    } catch (err: unknown) {
                      toast.error(err instanceof Error ? err.message : 'Unknown error');
                    } finally {
                      setRerunLoading(false);
                    }
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Trigger First Run
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Run #</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Conclusion</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {runs.map(run => {
                      const getStatusIcon = (status: string, conclusion: string | null) => {
                        if (status === 'completed') {
                          return conclusion === 'success' ? 
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                            <AlertTriangle className="w-4 h-4 text-red-500" />;
                        }
                        return <Timer className="w-4 h-4 text-yellow-500 animate-pulse" />;
                      };

                      return (
                        <TableRow key={run.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">#{run.run_number}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(run.status, run.conclusion)}
                              <span className="capitalize">{run.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={run.conclusion === 'success' ? 'default' : 'destructive'}>
                              {run.conclusion || 'Running'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <GitBranch className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">{run.head_branch}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(run.created_at).toLocaleDateString()} at{' '}
                            {new Date(run.created_at).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleViewLogs(run.id)}>
                                <Eye className="w-3 h-3 mr-1" />
                                Logs
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(run.html_url, '_blank', 'noopener,noreferrer')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                GitHub
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Log Drawer */}
      <Drawer open={logDrawerOpen} onOpenChange={setLogDrawerOpen}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Workflow Run Logs
            </DrawerTitle>
            <DrawerDescription>
              Run #{logRunId && runs.find(r => r.id === logRunId)?.run_number} - {logRunId && runs.find(r => r.id === logRunId)?.head_branch}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-6 pb-6 flex-1 overflow-hidden">
            {logsLoading ? (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading logs...</p>
              </div>
            ) : logsError ? (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-700 dark:text-red-400">{logsError}</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden max-h-96">
                <div className="h-full overflow-y-auto">
                  {logs && typeof logs === 'object' ? (
                    Object.entries(logs).map(([file, content]) => (
                      <div key={file} className="border-b last:border-b-0">
                        <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
                          {file}
                        </div>
                        <pre className="bg-muted/50 p-4 text-xs font-mono whitespace-pre-wrap break-all text-foreground">
                          {content as string}
                        </pre>
                      </div>
                    ))
                  ) : logs ? (
                    <pre className="bg-muted/50 p-6 text-sm font-mono whitespace-pre-wrap text-foreground">
                      {logs}
                    </pre>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-12 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Logs Available</h3>
                      <p className="text-muted-foreground">
                        No logs found for this workflow run.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="px-6 pb-6">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}