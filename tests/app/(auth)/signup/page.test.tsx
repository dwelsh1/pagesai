import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '../../../../app/(auth)/signup/page';

describe('SignupPage', () => {
  it('should render signup page with correct structure', () => {
    render(<SignupPage />);

    expect(screen.getByText('PagesAI')).toBeInTheDocument();
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('sign-up-button')).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<SignupPage />);

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
    render(<SignupPage />);

    const title = screen.getByText('PagesAI');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-gray-900', 'mb-2');
  });

  it('should render subtitle with correct styling', () => {
    render(<SignupPage />);

    const subtitle = screen.getByText('Create your account');
    expect(subtitle).toHaveClass('text-gray-600');
  });

  it('should render sign in link', () => {
    render(<SignupPage />);

    const signInLink = screen.getByTestId('sign-in-link');
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/login');
  });
});
