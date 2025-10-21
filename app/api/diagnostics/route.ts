import { NextResponse } from 'next/server';
import { getServerSession } from '@/server/auth';

export async function GET() {
  try {
    // System Status
    const systemStatus = {
      server: 'running',
      statusCode: 200,
      api: 'healthy',
      onlineStatus: 'online'
    };

    // Package Versions (hardcoded for now)
    const packageVersions = {
      editor: '0.1.0',
      ui: '0.1.0',
      utils: '0.1.0',
      types: '0.1.0',
      nextjs: '15.5.6',
      react: '19.2.0'
    };

    // App Environment
    const appEnvironment = {
      platform: 'Desktop App (Electron)',
      version: 'PagesAI v0.1.0',
      osPlatform: process.platform,
      hostname: process.env.HOSTNAME || 'localhost',
      port: process.env.PORT || '3001',
      url: process.env.NODE_ENV === 'production' 
        ? 'https://pagesai.app' 
        : `http://localhost:${process.env.PORT || '3001'}`,
      nodeEnv: process.env.NODE_ENV || 'development'
    };

    // Performance Metrics (basic)
    const performanceMetrics = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      loadTime: Date.now() // This would be calculated on the client side
    };

    // System Information
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      cwd: process.cwd()
    };

    const diagnostics = {
      timestamp: new Date().toISOString(),
      systemStatus,
      packageVersions,
      appEnvironment,
      performanceMetrics,
      systemInfo,
      user: {
        id: 'demo-user',
        username: 'admin',
        email: 'admin@example.com'
      }
    };

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    console.error('Error fetching diagnostics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
