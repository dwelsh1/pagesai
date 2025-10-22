import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiagnosticsPage from '../../../app/diagnostics/page';

// Mock MainLayout to avoid DOM manipulation issues
vi.mock('@/components/layout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock window.location
const mockLocation = {
  href: '',
  reload: vi.fn(),
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock localStorage and sessionStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

// Mock console methods
const mockConsole = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
};

Object.defineProperty(console, 'log', {
  value: mockConsole.log,
  writable: true,
});

Object.defineProperty(console, 'error', {
  value: mockConsole.error,
  writable: true,
});

Object.defineProperty(console, 'warn', {
  value: mockConsole.warn,
  writable: true,
});

Object.defineProperty(console, 'info', {
  value: mockConsole.info,
  writable: true,
});

// Mock document.createElement for download functionality
const mockLink = {
  href: '',
  download: '',
  click: vi.fn(),
};

Object.defineProperty(document, 'createElement', {
  value: vi.fn(() => mockLink),
  writable: true,
});

// Mock document event listeners
Object.defineProperty(document, 'addEventListener', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(document, 'removeEventListener', {
  value: vi.fn(),
  writable: true,
});

// Mock URL.createObjectURL and URL.revokeObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: vi.fn(() => 'mock-url'),
  writable: true,
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: vi.fn(),
  writable: true,
});

// Mock Blob constructor
global.Blob = vi.fn(() => ({
  size: 0,
  type: 'application/json',
})) as any;

describe('DiagnosticsPage', () => {
  const mockDiagnosticsData = {
    timestamp: '2024-01-01T00:00:00.000Z',
    systemStatus: {
      server: 'running',
      statusCode: 200,
      api: 'healthy',
      onlineStatus: 'online',
    },
    packageVersions: {
      editor: '0.1.0',
      ui: '0.1.0',
      utils: '0.1.0',
      types: '0.1.0',
      nextjs: '15.5.6',
      react: '19.2.0',
    },
    appEnvironment: {
      platform: 'Desktop App (Electron)',
      version: 'PagesAI v0.1.0',
      osPlatform: 'win32',
      hostname: 'localhost',
      port: '3001',
      url: 'http://localhost:3001',
      nodeEnv: 'development',
    },
    performanceMetrics: {
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
      loadTime: Date.now(),
    },
    systemInfo: {
      nodeVersion: 'v22.0.0',
      platform: 'win32',
      arch: 'x64',
      pid: 12345,
      cwd: '/test/path',
    },
    user: {
      id: 'demo-user',
      username: 'admin',
      email: 'admin@example.com',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockDiagnosticsData),
    });
    mockLocation.href = '';
    mockLocation.reload.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Page Rendering', () => {
    it('should render the diagnostics page with all sections', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('System Diagnostics')).toBeInTheDocument();
      });

      // Check for main sections
      expect(screen.getByText('System Status')).toBeInTheDocument();
      expect(screen.getByText('Package Versions')).toBeInTheDocument();
      expect(screen.getByText('App Environment')).toBeInTheDocument();
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
      expect(screen.getByText('System Information')).toBeInTheDocument();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Console Logs')).toBeInTheDocument();
    });

    it('should display loading state initially', () => {
      render(<DiagnosticsPage />);
      expect(screen.getByText('Loading diagnostics...')).toBeInTheDocument();
    });

    it('should display error state when API fails', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));
      
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Error loading diagnostics: API Error')).toBeInTheDocument();
      });
    });
  });

  describe('System Status Display', () => {
    it('should display system status information', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Server')).toBeInTheDocument();
        expect(screen.getByText('running')).toBeInTheDocument();
        expect(screen.getByText('API')).toBeInTheDocument();
        expect(screen.getByText('healthy')).toBeInTheDocument();
        expect(screen.getByText('Online Status')).toBeInTheDocument();
        expect(screen.getByText('online')).toBeInTheDocument();
      });
    });

    it('should display status codes correctly', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('200')).toBeInTheDocument();
      });
    });
  });

  describe('Package Versions Display', () => {
    it('should display all package versions', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Editor')).toBeInTheDocument();
        expect(screen.getByText('0.1.0')).toBeInTheDocument();
        expect(screen.getByText('Next.js')).toBeInTheDocument();
        expect(screen.getByText('15.5.6')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('19.2.0')).toBeInTheDocument();
      });
    });
  });

  describe('App Environment Display', () => {
    it('should display environment information', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Platform')).toBeInTheDocument();
        expect(screen.getByText('Desktop App (Electron)')).toBeInTheDocument();
        expect(screen.getByText('Version')).toBeInTheDocument();
        expect(screen.getByText('PagesAI v0.1.0')).toBeInTheDocument();
        expect(screen.getByText('OS Platform')).toBeInTheDocument();
        expect(screen.getByText('win32')).toBeInTheDocument();
      });
    });
  });

  describe('Performance Metrics Display', () => {
    it('should display performance metrics', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Uptime')).toBeInTheDocument();
        expect(screen.getByText('Memory Usage')).toBeInTheDocument();
        expect(screen.getByText('CPU Usage')).toBeInTheDocument();
        expect(screen.getByText('Load Time')).toBeInTheDocument();
      });
    });

    it('should format uptime correctly', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('1h 0m 0s')).toBeInTheDocument();
      });
    });

    it('should format memory usage correctly', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('95.37 MB')).toBeInTheDocument();
      });
    });
  });

  describe('System Information Display', () => {
    it('should display system information', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Node Version')).toBeInTheDocument();
        expect(screen.getByText('v22.0.0')).toBeInTheDocument();
        expect(screen.getByText('Architecture')).toBeInTheDocument();
        expect(screen.getByText('x64')).toBeInTheDocument();
        expect(screen.getByText('Process ID')).toBeInTheDocument();
        expect(screen.getByText('12345')).toBeInTheDocument();
      });
    });
  });

  describe('Quick Actions', () => {
    it('should render all quick action buttons', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Clear Auth')).toBeInTheDocument();
        expect(screen.getByText('Reset Data')).toBeInTheDocument();
        expect(screen.getByText('Reload App')).toBeInTheDocument();
        expect(screen.getByText('Simulate Error')).toBeInTheDocument();
      });
    });

    it('should have tooltips on all buttons', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        const clearAuthButton = screen.getByText('Clear Auth');
        const resetDataButton = screen.getByText('Reset Data');
        const reloadAppButton = screen.getByText('Reload App');
        const simulateErrorButton = screen.getByText('Simulate Error');

        expect(clearAuthButton).toHaveAttribute('title');
        expect(resetDataButton).toHaveAttribute('title');
        expect(reloadAppButton).toHaveAttribute('title');
        expect(simulateErrorButton).toHaveAttribute('title');
      });
    });

    it('should show Clear Auth confirmation dialog', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Clear Auth')).toBeInTheDocument();
      });

      const clearAuthButton = screen.getByText('Clear Auth');
      await user.click(clearAuthButton);

      expect(screen.getByText('Clear Authentication')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to clear your authentication data?')).toBeInTheDocument();
      expect(screen.getByText('Remove your login session')).toBeInTheDocument();
      expect(screen.getByText('Clear session storage')).toBeInTheDocument();
      expect(screen.getByText('Redirect you to the login page')).toBeInTheDocument();
    });

    it('should show Reset Data confirmation dialog', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Reset Data')).toBeInTheDocument();
      });

      const resetDataButton = screen.getByText('Reset Data');
      await user.click(resetDataButton);

      expect(screen.getByText('Reset All Data')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to reset all application data?')).toBeInTheDocument();
      expect(screen.getByText('All localStorage data')).toBeInTheDocument();
      expect(screen.getByText('All sessionStorage data')).toBeInTheDocument();
      expect(screen.getByText('User preferences and settings')).toBeInTheDocument();
      expect(screen.getByText('Cached application data')).toBeInTheDocument();
    });

    it('should execute Clear Auth when confirmed', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Clear Auth')).toBeInTheDocument();
      });

      const clearAuthButton = screen.getByText('Clear Auth');
      await user.click(clearAuthButton);

      const confirmButton = screen.getByText('Clear Auth');
      await user.click(confirmButton);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('session');
      expect(mockSessionStorage.clear).toHaveBeenCalled();
      expect(mockLocation.href).toBe('/login');
    });

    it('should execute Reset Data when confirmed', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Reset Data')).toBeInTheDocument();
      });

      const resetDataButton = screen.getByText('Reset Data');
      await user.click(resetDataButton);

      const confirmButton = screen.getByText('Reset All Data');
      await user.click(confirmButton);

      expect(mockLocalStorage.clear).toHaveBeenCalled();
      expect(mockSessionStorage.clear).toHaveBeenCalled();
      expect(mockLocation.reload).toHaveBeenCalled();
    });

    it('should cancel Clear Auth dialog', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Clear Auth')).toBeInTheDocument();
      });

      const clearAuthButton = screen.getByText('Clear Auth');
      await user.click(clearAuthButton);

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(screen.queryByText('Clear Authentication')).not.toBeInTheDocument();
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });

    it('should cancel Reset Data dialog', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Reset Data')).toBeInTheDocument();
      });

      const resetDataButton = screen.getByText('Reset Data');
      await user.click(resetDataButton);

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(screen.queryByText('Reset All Data')).not.toBeInTheDocument();
      expect(mockLocalStorage.clear).not.toHaveBeenCalled();
    });

    it('should execute Reload App action', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Reload App')).toBeInTheDocument();
      });

      const reloadButton = screen.getByText('Reload App');
      await user.click(reloadButton);

      expect(mockLocation.reload).toHaveBeenCalled();
    });

    it('should execute Simulate Error action', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Simulate Error')).toBeInTheDocument();
      });

      const simulateButton = screen.getByText('Simulate Error');
      await user.click(simulateButton);

      expect(mockConsole.error).toHaveBeenCalledWith('🚨 Simulated authentication error for testing');
    });
  });

  describe('Top Action Buttons', () => {
    it('should render top action buttons with tooltips', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        const refreshButton = screen.getByText('Refresh');
        const exportReportButton = screen.getByText('Export Report');
        const exportLogsButton = screen.getByText('Export Logs');

        expect(refreshButton).toHaveAttribute('title');
        expect(exportReportButton).toHaveAttribute('title');
        expect(exportLogsButton).toHaveAttribute('title');
      });
    });

    it('should refresh diagnostics data when Refresh clicked', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Refresh')).toBeInTheDocument();
      });

      const refreshButton = screen.getByText('Refresh');
      await user.click(refreshButton);

      expect(mockFetch).toHaveBeenCalledTimes(2); // Initial load + refresh
    });

    it('should export diagnostics report', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Export Report')).toBeInTheDocument();
      });

      const exportButton = screen.getByText('Export Report');
      await user.click(exportButton);

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockLink.download).toMatch(/pagesai-diagnostics-\d{4}-\d{2}-\d{2}\.json$/);
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should export console logs', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Export Logs')).toBeInTheDocument();
      });

      const exportButton = screen.getByText('Export Logs');
      await user.click(exportButton);

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockLink.download).toMatch(/pagesai-logs-\d{4}-\d{2}-\d{2}\.json$/);
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('Console Logs', () => {
    it('should display console logs section', async () => {
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Console Logs')).toBeInTheDocument();
        expect(screen.getByText('No console logs captured yet.')).toBeInTheDocument();
      });
    });

    it('should capture and display console logs', async () => {
      render(<DiagnosticsPage />);

      // Simulate console.log calls
      console.log('Test log message');
      console.error('Test error message');
      console.warn('Test warning message');

      await waitFor(() => {
        expect(screen.getByText('Test log message')).toBeInTheDocument();
        expect(screen.getByText('Test error message')).toBeInTheDocument();
        expect(screen.getByText('Test warning message')).toBeInTheDocument();
      });
    });

    it('should clear console logs', async () => {
      const user = userEvent.setup();
      render(<DiagnosticsPage />);

      // Add some logs
      console.log('Test message');
      
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });

      const clearButton = screen.getByText('Clear Logs');
      await user.click(clearButton);

      expect(screen.getByText('No console logs captured yet.')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Error loading diagnostics: Network error')).toBeInTheDocument();
      });
    });

    it('should handle malformed API responses', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ invalid: 'data' }),
      });
      
      render(<DiagnosticsPage />);

      await waitFor(() => {
        expect(screen.getByText('Error loading diagnostics')).toBeInTheDocument();
      });
    });
  });
});
