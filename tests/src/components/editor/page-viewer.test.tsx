import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PageViewer } from '@/components/editor/page-viewer';

// Mock BlockNote components
vi.mock('@blocknote/react', () => ({
  BlockNoteViewEditor: vi.fn(({ editor }) => (
    <div data-testid="blocknote-viewer">Mock Viewer</div>
  )),
}));

vi.mock('@blocknote/core', () => ({
  BlockNoteEditor: {
    create: vi.fn(() => ({
      document: [],
      onChange: vi.fn(),
      destroy: vi.fn(),
    })),
  },
  BlockNoteSchema: {
    create: vi.fn(() => ({})),
  },
  defaultBlockSpecs: {},
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardTitle: ({ children, ...props }: any) => (
    <h3 {...props}>{children}</h3>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  ),
}));

// Mock fetch
global.fetch = vi.fn();

describe('PageViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<PageViewer pageId="test-id" />);
    
    expect(screen.getByText('Loading page...')).toBeInTheDocument();
  });

  it('shows error when page is not found', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<PageViewer pageId="test-id" />);
    
    await waitFor(() => {
      expect(screen.getByText('Page not found')).toBeInTheDocument();
    });
  });

  it('shows error when fetch fails', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<PageViewer pageId="test-id" />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load page')).toBeInTheDocument();
    });
  });

  it('renders page content when loaded successfully', async () => {
    const mockPage = {
      id: 'test-id',
      title: 'Test Page',
      content: '[]',
      description: 'Test Description',
      tags: 'test, page',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      user: {
        username: 'testuser',
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ page: mockPage }),
    });

    render(<PageViewer pageId="test-id" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Page')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });
  });

  it('renders tags when available', async () => {
    const mockPage = {
      id: 'test-id',
      title: 'Test Page',
      content: '[]',
      tags: 'tag1, tag2, tag3',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      user: {
        username: 'testuser',
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ page: mockPage }),
    });

    render(<PageViewer pageId="test-id" />);
    
    await waitFor(() => {
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.getByText('tag3')).toBeInTheDocument();
    });
  });

  it('renders editor after page loads', async () => {
    const mockPage = {
      id: 'test-id',
      title: 'Test Page',
      content: '[]',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      user: {
        username: 'testuser',
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ page: mockPage }),
    });

    render(<PageViewer pageId="test-id" />);
    
    await waitFor(() => {
      expect(screen.getByTestId('blocknote-viewer')).toBeInTheDocument();
    });
  });
});
