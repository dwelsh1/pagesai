import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import DashboardPage from '../../../app/dashboard/page';

// Mock the MainLayout component
vi.mock('@/components/layout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

// Mock the UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div data-testid="card-content" {...props}>
      {children}
    </div>
  ),
  CardDescription: ({ children, ...props }: any) => (
    <div data-testid="card-description" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div data-testid="card-header" {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, ...props }: any) => (
    <div data-testid="card-title" {...props}>
      {children}
    </div>
  ),
}));

describe('DashboardPage', () => {
  it('should render the dashboard with welcome section', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Welcome to PagesAI')).toBeInTheDocument();
    expect(screen.getByText('Create, organize, and export your pages with ease.')).toBeInTheDocument();
  });

  it('should render quick action buttons', () => {
    render(<DashboardPage />);

    expect(screen.getByText('New Page')).toBeInTheDocument();
    expect(screen.getByText('Import Document')).toBeInTheDocument();
    expect(screen.getByText('View Calendar')).toBeInTheDocument();
  });

  it('should render stats cards', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Total Pages')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Pages This Week')).toBeInTheDocument();
    expect(screen.getByText('Storage Used')).toBeInTheDocument();
  });

  it('should display correct stats values', () => {
    render(<DashboardPage />);

    expect(screen.getByText('24')).toBeInTheDocument(); // Total Pages
    expect(screen.getByText('8')).toBeInTheDocument(); // Recent Activity
    expect(screen.getByText('5')).toBeInTheDocument(); // Pages This Week
    expect(screen.getByText('2.4 MB')).toBeInTheDocument(); // Storage Used
  });

  it('should render recent pages section', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Recent Pages')).toBeInTheDocument();
    expect(screen.getByText('Your most recently updated pages')).toBeInTheDocument();
    
    // Check for recent page items
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Project Documentation')).toBeInTheDocument();
    expect(screen.getByText('Meeting Notes')).toBeInTheDocument();
    expect(screen.getByText('API Reference')).toBeInTheDocument();
  });

  it('should render quick start guide', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Quick Start')).toBeInTheDocument();
    expect(screen.getByText('Get started with PagesAI')).toBeInTheDocument();
    
    // Check for quick start steps
    expect(screen.getByText('Create your first page')).toBeInTheDocument();
    expect(screen.getByText('Organize with folders')).toBeInTheDocument();
    expect(screen.getByText('Export your work')).toBeInTheDocument();
  });

  it('should handle New Page button click', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
    
    render(<DashboardPage />);

    const newPageButton = screen.getByText('New Page');
    await user.click(newPageButton);

    expect(consoleSpy).toHaveBeenCalledWith('Creating new page...');
    
    consoleSpy.mockRestore();
  });

  it('should display recent page timestamps', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Updated 2 hours ago')).toBeInTheDocument();
    expect(screen.getByText('Updated 1 day ago')).toBeInTheDocument();
    expect(screen.getByText('Updated 2 days ago')).toBeInTheDocument();
    expect(screen.getByText('Updated 3 days ago')).toBeInTheDocument();
  });

  it('should render Open buttons for recent pages', () => {
    render(<DashboardPage />);

    const openButtons = screen.getAllByText('Open');
    expect(openButtons).toHaveLength(4); // One for each recent page
  });

  it('should have proper card structure', () => {
    render(<DashboardPage />);

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(6); // 4 stats cards + 2 main cards

    const cardHeaders = screen.getAllByTestId('card-header');
    expect(cardHeaders).toHaveLength(6);

    const cardContents = screen.getAllByTestId('card-content');
    expect(cardContents).toHaveLength(6);
  });

  it('should render step numbers in quick start guide', () => {
    render(<DashboardPage />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should have proper accessibility structure', () => {
    render(<DashboardPage />);

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Welcome to PagesAI');

    // Check for proper button roles
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render within MainLayout', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });
});
