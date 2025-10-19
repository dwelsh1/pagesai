import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../app/(auth)/login/page';

describe('LoginPage', () => {
  it('should render login page with correct structure', () => {
    render(<LoginPage />);

    expect(screen.getByText('PagesAI')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<LoginPage />);

    const container = screen.getByText('PagesAI').closest('div')?.parentElement
      ?.parentElement?.parentElement;
    expect(container).toHaveClass(
      'min-h-screen',
      'bg-gray-100',
      'flex',
      'items-center',
      'justify-center',
      'p-4'
    );

    const card = screen.getByText('PagesAI').closest('div')?.parentElement;
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm', 'p-8');
  });

  it('should render title with correct styling', () => {
    render(<LoginPage />);

    const title = screen.getByText('PagesAI');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-gray-900', 'mb-2');
  });

  it('should render subtitle with correct styling', () => {
    render(<LoginPage />);

    const subtitle = screen.getByText('Sign in to your account');
    expect(subtitle).toHaveClass('text-gray-600');
  });
});
