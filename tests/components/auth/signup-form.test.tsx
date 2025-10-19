import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupForm } from '@/components/auth/signup-form';
import { ZodError } from 'zod';

// Mock fetch
global.fetch = vi.fn();

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetch).mockClear();
  });

  it('should render signup form with all required elements', () => {
    render(<SignupForm />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email (Optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('sign-up-button')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-link')).toBeInTheDocument();
  });

  it('should handle form input changes', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const usernameInput = screen.getByTestId('username-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle successful registration', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      success: true,
      user: {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
      },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(<SignupForm />);

    const usernameInput = screen.getByTestId('username-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-up-button');

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Account Created!')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
      }),
    });
  });

  it('should handle registration errors', async () => {
    const user = userEvent.setup();
    const mockError = { error: 'Username already exists' };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    } as Response);

    render(<SignupForm />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-up-button');

    await user.type(usernameInput, 'existinguser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username already exists')).toBeInTheDocument();
    });
  });

  it('should handle email already exists error', async () => {
    const user = userEvent.setup();
    const mockError = { error: 'Email already exists' };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    } as Response);

    render(<SignupForm />);

    const usernameInput = screen.getByTestId('username-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-up-button');

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('should clear errors when user starts typing', async () => {
    const user = userEvent.setup();
    const mockError = { error: 'Username already exists' };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    } as Response);

    render(<SignupForm />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-up-button');

    await user.type(usernameInput, 'existinguser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username already exists')).toBeInTheDocument();
    });

    // Clear the error by typing
    await user.clear(usernameInput);
    await user.type(usernameInput, 'newuser');

    // Error should be cleared
    expect(screen.queryByText('Username already exists')).not.toBeInTheDocument();
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    
    // Mock a slow response
    vi.mocked(fetch).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true, user: {} }),
      } as Response), 100))
    );

    render(<SignupForm />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-up-button');

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText('Creating Account...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should render sign in link correctly', () => {
    render(<SignupForm />);

    const signInLink = screen.getByTestId('sign-in-link');
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/login');
    expect(signInLink).toHaveTextContent('Sign in');
  });

  it('should handle ZodError validation errors', async () => {
    const user = userEvent.setup();
    
    // Mock fetch to throw a ZodError
    vi.mocked(fetch).mockImplementationOnce(() => {
      const zodError = new ZodError([
        { path: ['username'], message: 'Username must be at least 3 characters', code: 'too_small' },
        { path: ['password'], message: 'Password must be at least 6 characters', code: 'too_small' }
      ]);
      throw zodError;
    });

    render(<SignupForm />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-up-button');

    await user.type(usernameInput, 'ab'); // Too short
    await user.type(passwordInput, '123'); // Too short
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should handle generic errors', async () => {
    const user = userEvent.setup();
    const mockError = { error: 'Something went wrong' };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    } as Response);

    render(<SignupForm />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-up-button');

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  it('should handle registration without email', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      success: true,
      user: {
        id: 'user123',
        username: 'testuser',
        email: null,
      },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(<SignupForm />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-up-button');

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Account Created!')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
        email: '',
      }),
    });
  });

  it('should handle success modal close button', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      success: true,
      user: { id: 'user123', username: 'testuser', email: 'test@example.com' },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(<SignupForm />);

    const usernameInput = screen.getByTestId('username-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-up-button');

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Account Created!')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    // Modal should be closed
    expect(screen.queryByText('Account Created!')).not.toBeInTheDocument();
  });

  it('should handle success modal go to sign in button', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      success: true,
      user: { id: 'user123', username: 'testuser', email: 'test@example.com' },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    // Mock window.location.href
    delete (window as any).location;
    window.location = { href: '' } as any;

    render(<SignupForm />);

    const usernameInput = screen.getByTestId('username-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('sign-up-button');

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Account Created!')).toBeInTheDocument();
    });

    const goToSignInButton = screen.getByText('Go to Sign In');
    await user.click(goToSignInButton);

    // Should redirect to login page
    expect(window.location.href).toBe('/login');
  });
});
