import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PageViewer } from '@/components/editor/page-viewer';

// Mock TipTap components
vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => ({
    isEditable: true,
    commands: {
      setContent: vi.fn(),
      focus: vi.fn(),
      toggleBold: vi.fn(),
      toggleItalic: vi.fn(),
      toggleUnderline: vi.fn(),
      toggleCodeBlock: vi.fn(),
      setHeading: vi.fn(),
      setParagraph: vi.fn(),
      toggleBulletList: vi.fn(),
      toggleOrderedList: vi.fn(),
      toggleBlockquote: vi.fn(),
      setTextAlign: vi.fn(),
      setLink: vi.fn(),
      insertContent: vi.fn(),
      setTextSelection: vi.fn(),
      selectAll: vi.fn(),
      chain: vi.fn(() => ({
        focus: vi.fn(() => ({
          toggleBold: vi.fn(() => ({ run: vi.fn() })),
          toggleItalic: vi.fn(() => ({ run: vi.fn() })),
          toggleUnderline: vi.fn(() => ({ run: vi.fn() })),
          toggleCodeBlock: vi.fn(() => ({ run: vi.fn() })),
          setHeading: vi.fn(() => ({ run: vi.fn() })),
          setParagraph: vi.fn(() => ({ run: vi.fn() })),
          toggleBulletList: vi.fn(() => ({ run: vi.fn() })),
          toggleOrderedList: vi.fn(() => ({ run: vi.fn() })),
          toggleBlockquote: vi.fn(() => ({ run: vi.fn() })),
          setTextAlign: vi.fn(() => ({ run: vi.fn() })),
          setLink: vi.fn(() => ({ run: vi.fn() })),
          insertContent: vi.fn(() => ({ run: vi.fn() })),
          run: vi.fn(),
        })),
      })),
    },
    getHTML: vi.fn(() => '<p>Test Page</p>'),
    setEditable: vi.fn(),
    destroy: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    isActive: vi.fn(() => false),
    isFocused: true,
    state: {
      selection: { from: 0, to: 0 },
      doc: { textBetween: vi.fn(() => '') },
    },
    view: {
      dom: { focus: vi.fn() },
      coordsAtPos: vi.fn(() => ({ left: 0, top: 0, right: 0 })),
    },
  })),
  EditorContent: vi.fn(({ editor }) => (
    <div data-testid="tiptap-editor">Mock TipTap Editor</div>
  )),
}));

vi.mock('@tiptap/starter-kit', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-underline', () => ({
  default: vi.fn(),
}));

vi.mock('@tiptap/extension-link', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-image', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-text-align', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-text-style', () => ({
  TextStyle: vi.fn(),
}));

vi.mock('@tiptap/extension-color', () => ({
  default: vi.fn(() => ({
    configure: vi.fn(() => ({})),
  })),
}));

vi.mock('@/lib/slash-command-extension', () => ({
  SlashCommand: vi.fn(),
}));

vi.mock('@/components/editor/floating-toolbar', () => ({
  FloatingToolbar: vi.fn(() => <div data-testid="floating-toolbar">Mock Floating Toolbar</div>),
}));

vi.mock('@/components/editor/slash-command-menu', () => ({
  SlashCommandMenu: vi.fn(() => <div data-testid="slash-command-menu">Mock Slash Command Menu</div>),
}));

vi.mock('@/components/editor/image-modal', () => ({
  ImageModal: vi.fn(() => <div data-testid="image-modal">Mock Image Modal</div>),
}));

vi.mock('@/components/editor/link-modal', () => ({
  LinkModal: vi.fn(() => <div data-testid="link-modal">Mock Link Modal</div>),
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
      expect(screen.getByTestId('tiptap-editor')).toBeInTheDocument();
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
      expect(screen.getByTestId('tiptap-editor')).toBeInTheDocument();
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
      expect(screen.getByTestId('tiptap-editor')).toBeInTheDocument();
    });
  });
});
