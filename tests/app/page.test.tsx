import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../../app/page';

describe('Home Page', () => {
  it('should render welcome message', () => {
    render(<HomePage />);

    expect(screen.getByText('Welcome to PagesAI')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<HomePage />);

    expect(
      screen.getByText('Your modern web application is ready!')
    ).toBeInTheDocument();
  });

  it('should render login link', () => {
    render(<HomePage />);

    const loginLink = screen.getByRole('link', { name: /go to login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('should render with correct styling', () => {
    render(<HomePage />);

    const container = screen.getByText('Welcome to PagesAI').closest('div')?.parentElement;
    expect(container).toHaveClass(
      'min-h-screen',
      'bg-gray-100',
      'flex',
      'items-center',
      'justify-center'
    );
  });
});
