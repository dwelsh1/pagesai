import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from '../../app/layout';

// Mock Next.js font
vi.mock('next/font/google', () => ({
  Inter: vi.fn(() => ({
    className: 'inter-font',
  })),
}));

describe('Root Layout', () => {
  it('should render children', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should have correct HTML structure', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const html = document.documentElement;
    expect(html).toHaveAttribute('lang', 'en');

    const body = document.body;
    expect(body).toHaveClass('inter-font');
  });

  it('should render with metadata', () => {
    // This test verifies the component renders without errors
    // The actual metadata is handled by Next.js at build time
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
