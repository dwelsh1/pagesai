import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Sidebar } from '@/components/layout/sidebar';

// Mock Next.js Link component
vi.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

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

  it('should render the sidebar with header and search', () => {
    render(<Sidebar />);

    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search pages...')).toBeInTheDocument();
    expect(screen.getByTitle('Create new page')).toBeInTheDocument();
  });

  it('should render mock pages by default', () => {
    render(<Sidebar />);

    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('should render custom pages when provided', () => {
    const customPages = [
      { id: '1', title: 'Custom Page 1' },
      { id: '2', title: 'Custom Page 2' },
    ];

    render(<Sidebar pages={customPages} />);

    expect(screen.getByText('Custom Page 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Page 2')).toBeInTheDocument();
    expect(screen.queryByText('Getting Started')).not.toBeInTheDocument();
  });

  it('should handle page expansion and collapse', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    // Find the expand/collapse button for "Getting Started"
    const expandButton = screen.getByTitle('Expand');
    await user.click(expandButton);

    // Should show children
    expect(screen.getByText('Welcome to PagesAI')).toBeInTheDocument();
    expect(screen.getByText('First Steps')).toBeInTheDocument();
    expect(screen.getByText('Basic Features')).toBeInTheDocument();

    // Click again to collapse
    const collapseButton = screen.getByTitle('Collapse');
    await user.click(collapseButton);

    // Children should be hidden
    expect(screen.queryByText('Welcome to PagesAI')).not.toBeInTheDocument();
  });

  it('should handle search functionality', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const searchInput = screen.getByPlaceholderText('Search pages...');
    await user.type(searchInput, 'Getting');

    // Should show only matching pages
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.queryByText('Documentation')).not.toBeInTheDocument();
  });

  it('should show context menu on hover', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    // Hover over a page to show context menu button
    const pageItem = screen.getByText('Getting Started').closest('.group');
    await user.hover(pageItem!);

    // Context menu button should appear
    const contextButton = screen.getByTitle('Page options');
    expect(contextButton).toBeInTheDocument();
  });

  it('should handle context menu actions', async () => {
    const user = userEvent.setup();
    render(<Sidebar onCreatePage={mockOnCreatePage} onEditPage={mockOnEditPage} onDeletePage={mockOnDeletePage} />);

    // Click context menu button
    const contextButton = screen.getByTitle('Page options');
    await user.click(contextButton);

    // Should show context menu
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();

    // Click edit
    await user.click(screen.getByText('Edit'));
    expect(mockOnEditPage).toHaveBeenCalledWith('1');
  });

  it('should render Diagnostics button in footer', () => {
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

  it('should show no pages message when no pages match search', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const searchInput = screen.getByPlaceholderText('Search pages...');
    await user.type(searchInput, 'nonexistent');

    expect(screen.getByText('No pages found')).toBeInTheDocument();
    expect(screen.getByText('Try a different search term')).toBeInTheDocument();
  });

  it('should render folder and file icons correctly', () => {
    render(<Sidebar />);

    // Should have folder icons for parent pages
    const folderIcons = screen.getAllByTestId('folder-icon');
    expect(folderIcons.length).toBeGreaterThan(0);

    // Should have file icons for leaf pages when expanded
    const expandButton = screen.getByTitle('Expand');
    fireEvent.click(expandButton);

    const fileIcons = screen.getAllByTestId('file-icon');
    expect(fileIcons.length).toBeGreaterThan(0);
  });

  it('should have proper accessibility attributes', () => {
    render(<Sidebar />);

    const searchInput = screen.getByPlaceholderText('Search pages...');
    expect(searchInput).toHaveAttribute('type', 'text');

    const createButton = screen.getByTitle('Create new page');
    expect(createButton).toHaveAttribute('title', 'Create new page');
  });
});
