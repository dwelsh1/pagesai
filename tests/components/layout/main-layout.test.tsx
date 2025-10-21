import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MainLayout } from '@/components/layout/main-layout';

// Mock the Header and Sidebar components
vi.mock('@/components/layout/header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

vi.mock('@/components/layout/sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

// Mock the UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, title, ...props }: any) => (
    <button onClick={onClick} title={title} {...props}>
      {children}
    </button>
  ),
}));

describe('MainLayout', () => {
  it('should render the main layout with all components', () => {
    render(
      <MainLayout>
        <div data-testid="main-content">Test Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('should render children in the main content area', () => {
    const testContent = 'Test Page Content';
    render(
      <MainLayout>
        <div>{testContent}</div>
      </MainLayout>
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    // Check that the layout has the proper structure
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    
    // Check for mobile header
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTitle('Toggle sidebar')).toBeInTheDocument();
  });

  it('should render multiple children correctly', () => {
    render(
      <MainLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </MainLayout>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });
});
