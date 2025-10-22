import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../../../../app/api/diagnostics/route';

// Mock the server auth module
vi.mock('@/server/auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock process properties
const mockProcess = {
  platform: 'win32',
  version: 'v22.0.0',
  arch: 'x64',
  pid: 12345,
  cwd: vi.fn(() => '/test/path'),
  uptime: vi.fn(() => 3600),
  memoryUsage: vi.fn(() => ({
    rss: 100000000,
    heapTotal: 50000000,
    heapUsed: 30000000,
    external: 10000000,
    arrayBuffers: 5000000,
  })),
  cpuUsage: vi.fn(() => ({
    user: 1000000,
    system: 500000,
  })),
};

// Mock environment variables
const mockEnv = {
  HOSTNAME: 'test-host',
  PORT: '3001',
  NODE_ENV: 'development',
};

describe('Diagnostics API Route', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock process properties using vi.stubGlobal
    vi.stubGlobal('process', {
      ...process,
      ...mockProcess,
      env: {
        ...process.env,
        ...mockEnv,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/diagnostics', () => {
    it('should return comprehensive diagnostics data', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('systemStatus');
      expect(data).toHaveProperty('packageVersions');
      expect(data).toHaveProperty('appEnvironment');
      expect(data).toHaveProperty('performanceMetrics');
      expect(data).toHaveProperty('systemInfo');
      expect(data).toHaveProperty('user');
    });

    it('should return correct system status', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.systemStatus).toEqual({
        server: 'running',
        statusCode: 200,
        api: 'healthy',
        onlineStatus: 'online',
      });
    });

    it('should return package versions', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.packageVersions).toEqual({
        editor: '0.1.0',
        ui: '0.1.0',
        utils: '0.1.0',
        types: '0.1.0',
        nextjs: '15.5.6',
        react: '19.2.0',
      });
    });

    it('should return app environment information', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.appEnvironment).toEqual({
        platform: 'Desktop App (Electron)',
        version: 'PagesAI v0.1.0',
        osPlatform: 'win32',
        hostname: 'test-host',
        port: '3001',
        url: 'http://localhost:3001',
        nodeEnv: 'development',
      });
    });

    it('should return performance metrics', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.performanceMetrics).toEqual({
        uptime: 3600,
        memoryUsage: {
          rss: 100000000,
          heapTotal: 50000000,
          heapUsed: 30000000,
          external: 10000000,
          arrayBuffers: 5000000,
        },
        cpuUsage: {
          user: 1000000,
          system: 500000,
        },
        loadTime: expect.any(Number),
      });
    });

    it('should return system information', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.systemInfo).toEqual({
        nodeVersion: 'v22.0.0',
        platform: 'win32',
        arch: 'x64',
        pid: 12345,
        cwd: '/test/path',
      });
    });

    it('should return demo user information', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.user).toEqual({
        id: 'demo-user',
        username: 'admin',
        email: 'admin@example.com',
      });
    });

    it('should handle production environment correctly', async () => {
      process.env.NODE_ENV = 'production';
      
      const response = await GET();
      const data = await response.json();

      expect(data.appEnvironment.url).toBe('https://pagesai.app');
      expect(data.appEnvironment.nodeEnv).toBe('production');
    });

    it('should handle missing environment variables', async () => {
      delete process.env.HOSTNAME;
      delete process.env.PORT;
      
      const response = await GET();
      const data = await response.json();

      expect(data.appEnvironment.hostname).toBe('localhost');
      expect(data.appEnvironment.port).toBe('3001');
    });

    it('should include timestamp in ISO format', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should handle errors gracefully', async () => {
      // Mock process.uptime to throw an error
      process.uptime = vi.fn(() => {
        throw new Error('Process error');
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });
});
