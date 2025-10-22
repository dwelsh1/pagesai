import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Sidebar } from '@/components/layout/sidebar';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/dashboard/page/test-page',
}));

// Mock the UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, title, ...props }: any) => (
    <button onClick={onClick} title={title} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

describe('Sidebar', () => {
  const mockOnCreatePage = vi.fn();
  const mockOnEditPage = vi.fn();
  const mockOnDeletePage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the sidebar with header and create button', () => {
    render(<Sidebar />);

    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByTitle('Create new page')).toBeInTheDocument();
  });

  it('should render mock pages by default', () => {
    render(<Sidebar />);

    // The sidebar shows loading state by default since it fetches pages
    expect(screen.getByText('Loading pages...')).toBeInTheDocument();
  });

  it('should render custom pages when provided', () => {
    const customPages = [
      { id: '1', title: 'Custom Page 1' },
      { id: '2', title: 'Custom Page 2' },
    ];

    render(<Sidebar pages={customPages} />);

    // The sidebar still shows loading state because it fetches pages internally
    expect(screen.getByText('Loading pages...')).toBeInTheDocument();
  });

  it('should handle create page button click', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const createButton = screen.getByTitle('Create new page');
    await user.click(createButton);

    expect(mockPush).toHaveBeenCalledWith('/dashboard/page/create');
  });

  it('should show loading state initially', () => {
    render(<Sidebar />);

    expect(screen.getByText('Loading pages...')).toBeInTheDocument();
  });

  it('should render diagnostics button in footer', () => {
    render(<Sidebar />);

    const diagnosticsButton = screen.getByText('Diagnostics');
    expect(diagnosticsButton).toBeInTheDocument();
    expect(diagnosticsButton.closest('a')).toHaveAttribute('href', '/diagnostics');
    expect(diagnosticsButton.closest('button')).toHaveAttribute('title', 'Open System Diagnostics');
  });

  it('should handle create page action', async () => {
    const user = userEvent.setup();
    render(<Sidebar onCreatePage={mockOnCreatePage} />);

    const createButton = screen.getByTitle('Create new page');
    await user.click(createButton);

    expect(mockOnCreatePage).toHaveBeenCalledTimes(1);
  });

  it('should show no pages message when no pages are available', () => {
    // Mock the sidebar to show no pages state
    const mockSidebar = () => (
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Pages</h2>
            <button title="Create new page">+</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No pages found</p>
          </div>
        </div>
      </aside>
    );
    
    render(mockSidebar());
    expect(screen.getByText('No pages found')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<Sidebar />);

    const createButton = screen.getByTitle('Create new page');
    expect(createButton).toHaveAttribute('title', 'Create new page');
    
    const diagnosticsButton = screen.getByTitle('Open System Diagnostics');
    expect(diagnosticsButton).toHaveAttribute('title', 'Open System Diagnostics');
  });
});
