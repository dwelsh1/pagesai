'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  RefreshCw, 
  Download, 
  ExternalLink, 
  Trash2, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Monitor,
  Database,
  Package,
  Settings,
  Activity,
  Bug
} from 'lucide-react';

interface DiagnosticsData {
  timestamp: string;
  systemStatus: {
    server: string;
    statusCode: number;
    api: string;
    onlineStatus: string;
  };
  packageVersions: {
    editor: string;
    ui: string;
    utils: string;
    types: string;
    nextjs: string;
    react: string;
  };
  appEnvironment: {
    platform: string;
    version: string;
    osPlatform: string;
    hostname: string;
    port: string;
    url: string;
    nodeEnv: string;
  };
  performanceMetrics: {
    uptime: number;
    memoryUsage: any;
    cpuUsage: any;
    loadTime: number;
  };
  systemInfo: {
    nodeVersion: string;
    platform: string;
    arch: string;
    pid: number;
    cwd: string;
  };
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showClearAuthDialog, setShowClearAuthDialog] = useState(false);

  // Capture console logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      setLogs(prev => [...prev.slice(-99), { 
        type: 'log', 
        message: args.join(' '), 
        timestamp: new Date().toISOString() 
      }]);
      originalLog(...args);
    };

    console.error = (...args) => {
      setLogs(prev => [...prev.slice(-99), { 
        type: 'error', 
        message: args.join(' '), 
        timestamp: new Date().toISOString() 
      }]);
      originalError(...args);
    };

    console.warn = (...args) => {
      setLogs(prev => [...prev.slice(-99), { 
        type: 'warn', 
        message: args.join(' '), 
        timestamp: new Date().toISOString() 
      }]);
      originalWarn(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const fetchDiagnostics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🌐 Making API call to /api/diagnostics...');
      const response = await fetch('/api/diagnostics');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Diagnostics data received:', data);
        setDiagnostics(data);
      } else {
        console.error('❌ Failed to fetch diagnostics:', response.status);
        setError('Failed to fetch diagnostics');
      }
    } catch (err) {
      console.error('❌ Network error fetching diagnostics:', err);
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔍 Diagnostics page loaded');
    console.log('📊 Fetching system diagnostics...');
    fetchDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
      case 'healthy':
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
      case 'healthy':
      case 'online':
        return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'error':
      case 'offline':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const exportDiagnostics = () => {
    if (!diagnostics) return;
    
    const dataStr = JSON.stringify(diagnostics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pagesai-diagnostics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pagesai-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAuth = () => {
    setShowClearAuthDialog(true);
  };

  const confirmClearAuth = () => {
    console.log('🔐 Clearing authentication data...');
    localStorage.removeItem('session');
    sessionStorage.clear();
    console.log('✅ Authentication data cleared, redirecting to login');
    setShowClearAuthDialog(false);
    window.location.href = '/login';
  };

  const cancelClearAuth = () => {
    console.log('❌ Clear auth cancelled by user');
    setShowClearAuthDialog(false);
  };

  const resetData = () => {
    setShowResetDialog(true);
  };

  const confirmResetData = () => {
    console.log('🔄 Resetting all application data...');
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ All data reset, reloading application');
    setShowResetDialog(false);
    window.location.reload();
  };

  const cancelResetData = () => {
    console.log('❌ Data reset cancelled by user');
    setShowResetDialog(false);
  };

  const reloadApp = () => {
    console.log('🔄 Reloading application...');
    window.location.reload();
  };

  const simulateError = (type: string) => {
    console.error(`🧪 Simulating ${type} error for testing purposes`);
    switch (type) {
      case 'auth':
        console.error('❌ Simulated authentication failure');
        break;
      case 'network':
        console.error('❌ Simulated network error');
        break;
      case 'server':
        console.error('❌ Simulated server error');
        break;
      default:
        console.error('❌ Simulated generic error');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading diagnostics...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Diagnostics</h1>
            <p className="text-muted-foreground">
              Last updated: {diagnostics ? new Date(diagnostics.timestamp).toLocaleTimeString() : 'Never'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={fetchDiagnostics} variant="outline" size="sm" title="Refresh diagnostics data">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportDiagnostics} variant="outline" size="sm" title="Export complete diagnostics report as JSON">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={exportLogs} variant="outline" size="sm" title="Export console logs as JSON">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {!diagnostics && !isLoading && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <p className="text-yellow-700">No diagnostics data available. Click Refresh to load.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {diagnostics && diagnostics.systemStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Server</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(diagnostics.systemStatus.server)}
                    {getStatusBadge(diagnostics.systemStatus.server)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>API</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(diagnostics.systemStatus.api)}
                    {getStatusBadge(diagnostics.systemStatus.api)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Online Status</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(diagnostics.systemStatus.onlineStatus)}
                    {getStatusBadge(diagnostics.systemStatus.onlineStatus)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Storage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Storage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>localStorage</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Working</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>sessionStorage</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Working</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Package Versions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Package Versions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Editor</span>
                  <Badge variant="outline">{diagnostics.packageVersions.editor}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>UI</span>
                  <Badge variant="outline">{diagnostics.packageVersions.ui}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Utils</span>
                  <Badge variant="outline">{diagnostics.packageVersions.utils}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Types</span>
                  <Badge variant="outline">{diagnostics.packageVersions.types}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* App Environment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>App Environment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Platform</span>
                  <span className="text-sm text-muted-foreground">{diagnostics.appEnvironment.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span>Version</span>
                  <span className="text-sm text-muted-foreground">{diagnostics.appEnvironment.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>OS Platform</span>
                  <span className="text-sm text-muted-foreground">{diagnostics.appEnvironment.osPlatform}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hostname</span>
                  <span className="text-sm text-muted-foreground">{diagnostics.appEnvironment.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span>Port</span>
                  <span className="text-sm text-muted-foreground">{diagnostics.appEnvironment.port}</span>
                </div>
                <div className="flex justify-between">
                  <span>URL</span>
                  <span className="text-sm text-muted-foreground">{diagnostics.appEnvironment.url}</span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Uptime</span>
                  <span className="text-sm text-muted-foreground">{Math.round(diagnostics.performanceMetrics.uptime)}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(diagnostics.performanceMetrics.memoryUsage.heapUsed / 1024 / 1024)}MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Node Version</span>
                  <span className="text-sm text-muted-foreground">{diagnostics.systemInfo.nodeVersion}</span>
                </div>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>System Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Platform</span>
                  <span className="text-sm text-muted-foreground">{diagnostics.systemInfo.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span>Architecture</span>
                  <span className="text-sm text-muted-foreground">{diagnostics.systemInfo.arch}</span>
                </div>
                <div className="flex justify-between">
                  <span>Process ID</span>
                  <span className="text-sm text-muted-foreground">{diagnostics.systemInfo.pid}</span>
                </div>
                <div className="flex justify-between">
                  <span>User Agent</span>
                  <span className="text-sm text-muted-foreground truncate">
                    {navigator.userAgent.substring(0, 50)}...
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bug className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button onClick={clearAuth} variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50" title="Clear authentication data and redirect to login">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Auth
              </Button>
              <Button onClick={resetData} variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50" title="Clear all stored data and reload the application">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Data
              </Button>
              <Button onClick={reloadApp} variant="outline" className="w-full" title="Reload the entire application">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload App
              </Button>
              <Button onClick={() => simulateError('auth')} variant="outline" className="w-full" title="Simulate an authentication error for testing">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Simulate Error
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Use these actions if you're experiencing issues with the application.
            </p>
          </CardContent>
        </Card>

        {/* Console Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Console Logs ({logs.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {logs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No logs captured yet</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-muted-foreground w-20">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`w-16 ${
                      log.type === 'error' ? 'text-red-500' : 
                      log.type === 'warn' ? 'text-yellow-500' : 
                      'text-foreground'
                    }`}>
                      [{log.type}]
                    </span>
                    <span className="flex-1">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reset Data Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Reset All Data</span>
            </DialogTitle>
            <DialogDescription className="text-base text-gray-700">
              Are you sure you want to reset all application data? This will permanently clear:
            </DialogDescription>
            <div className="mt-3 space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">All localStorage data</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">All sessionStorage data</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">User preferences and settings</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Cached application data</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ This action cannot be undone.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button onClick={cancelResetData} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" title="Cancel the reset operation">
              Cancel
            </Button>
            <Button onClick={confirmResetData} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" title="Confirm and reset all data">
              Reset All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Auth Confirmation Dialog */}
      <Dialog open={showClearAuthDialog} onOpenChange={setShowClearAuthDialog}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Clear Authentication</span>
            </DialogTitle>
            <DialogDescription className="text-base text-gray-700">
              Are you sure you want to clear your authentication data? This will:
            </DialogDescription>
            <div className="mt-3 space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Remove your login session</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Clear session storage</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Redirect you to the login page</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-orange-800 font-medium">
                ⚠️ You will need to log in again to access the application.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button onClick={cancelClearAuth} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" title="Cancel clearing authentication">
              Cancel
            </Button>
            <Button onClick={confirmClearAuth} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" title="Confirm and clear authentication">
              Clear Auth
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </MainLayout>
  );
}
