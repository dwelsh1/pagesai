import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Header } from '@/components/layout/header';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/dashboard/page/test-page',
}));

// Mock the useAuth hook
const mockLogout = vi.fn();
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { username: 'testuser', email: 'test@example.com' },
    logout: mockLogout,
  }),
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

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the header with logo and navigation', () => {
    render(<Header />);

    expect(screen.getByText('PagesAI')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument(); // Logo text
    expect(screen.getAllByPlaceholderText('Search pages...')).toHaveLength(2); // Desktop and mobile
  });

  it('should render settings and user dropdown', () => {
    render(<Header />);

    expect(screen.getByTitle('Settings')).toBeInTheDocument();
    expect(screen.getByTitle('User menu')).toBeInTheDocument(); // User dropdown button
  });

  it('should handle search form submission', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const searchInputs = screen.getAllByPlaceholderText('Search pages...');
    const desktopSearchInput = searchInputs[0]; // Desktop search input
    const searchForm = desktopSearchInput.closest('form');

    await user.type(desktopSearchInput, 'test search');
    await user.click(searchForm!);

    // Should not navigate since search functionality is not implemented
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle logout when sign out is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // Click on user dropdown to open it
    const userButton = screen.getByTitle('User menu');
    await user.click(userButton);

    // Look for sign out option in dropdown
    const signOutButton = screen.getByText('Signout');
    await user.click(signOutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should have proper tooltips on buttons', () => {
    render(<Header />);

    const settingsButton = screen.getByTitle('Settings');
    const userButton = screen.getByTitle('User menu');

    expect(settingsButton).toBeInTheDocument();
    expect(userButton).toBeInTheDocument();
  });

  it('should render mobile menu buttons', () => {
    render(<Header />);

    // Check for mobile search and menu buttons
    const mobileButtons = screen.getAllByRole('button');
    const mobileSearchButton = mobileButtons.find(button => 
      button.getAttribute('title') === 'Search pages'
    );
    const mobileMenuButton = mobileButtons.find(button => 
      button.getAttribute('title') === 'Open menu'
    );

    expect(mobileSearchButton).toBeInTheDocument();
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('should render mobile search bar', () => {
    render(<Header />);

    // The mobile search bar should be present but hidden on desktop
    const mobileSearchBars = screen.getAllByPlaceholderText('Search pages...');
    expect(mobileSearchBars).toHaveLength(2); // Desktop and mobile versions
  });

  it('should handle search input changes', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const searchInput = screen.getAllByPlaceholderText('Search pages...')[0];
    await user.type(searchInput, 'test query');

    expect(searchInput).toHaveValue('test query');
  });

  it('should have proper accessibility attributes', () => {
    render(<Header />);

    const logoLink = screen.getByRole('link', { name: /pagesai/i });
    expect(logoLink).toHaveAttribute('href', '/dashboard');

    const searchInput = screen.getAllByPlaceholderText('Search pages...')[0];
    expect(searchInput).toHaveAttribute('type', 'text');
  });
});
