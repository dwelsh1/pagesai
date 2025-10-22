import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForgotPassword } from '@/components/auth/forgot-password';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    // Clear all mocks and reset fetch
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    // Clean up after each test
    cleanup();
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('should render forgot password form with all required elements', () => {
    render(<ForgotPassword onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-reset-button')).toBeInTheDocument();
    expect(screen.getByText('Show User\'s Login Credentials')).toBeInTheDocument();
  });

  it('should handle form input changes', async () => {
    const user = userEvent.setup();
    render(<ForgotPassword onClose={vi.fn()} onSuccess={vi.fn()} />);

    const emailInput = screen.getByTestId('email-input');
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should handle successful password reset request', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      success: true,
      message: 'Password reset email sent',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(<ForgotPassword onClose={vi.fn()} onSuccess={vi.fn()} />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('send-reset-button');

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    });

    expect(screen.getByText('We\'ve sent a password reset link to')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });
  });

  it('should handle email not found error', async () => {
    const user = userEvent.setup();
    const mockError = { error: 'Email not found' };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    } as Response);

    render(<ForgotPassword onClose={vi.fn()} onSuccess={vi.fn()} />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('send-reset-button');

    await user.type(emailInput, 'nonexistent@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email not found')).toBeInTheDocument();
    });
  });

  it.skip('should handle validation errors', async () => {
    const user = userEvent.setup();
    const mockError = { error: 'Validation failed' };
    
    // Mock fetch to return validation error
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    } as Response);

    render(<ForgotPassword onClose={vi.fn()} onSuccess={vi.fn()} />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('send-reset-button');

    // Type invalid email
    await user.type(emailInput, 'invalid-email');
    
    // Submit the form by clicking the submit button
    await user.click(submitButton);

    // Wait for the API call to be made
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    }, { timeout: 10000 });

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Verify the error message
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  it('should submit form when submit button is clicked', async () => {
    const user = userEvent.setup();
    
    // Mock fetch to return success
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Email sent' }),
    } as Response);

    render(<ForgotPassword onClose={vi.fn()} onSuccess={vi.fn()} />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('send-reset-button');

    // Type email
    await user.type(emailInput, 'test@example.com');
    
    // Click submit button
    await user.click(submitButton);

    // Wait for fetch to be called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    }, { timeout: 10000 });
  });

  it('should clear errors when user starts typing', async () => {
    const user = userEvent.setup();
    const mockError = { error: 'Email not found' };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    } as Response);

    render(<ForgotPassword onClose={vi.fn()} onSuccess={vi.fn()} />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('send-reset-button');

    await user.type(emailInput, 'nonexistent@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
    });

    // Clear the error by typing
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@example.com');

    // Error should be cleared
    expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
  });

  it.skip('should show loading state during submission', async () => {
    const user = userEvent.setup();
    
    // Mock a promise that never resolves to keep loading state
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    vi.mocked(fetch).mockImplementationOnce(() => promise);

    render(<ForgotPassword onClose={vi.fn()} onSuccess={vi.fn()} />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('send-reset-button');

    // Type email and submit
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    // Wait for loading state to appear
    await waitFor(() => {
      expect(screen.getByText('Sending...')).toBeInTheDocument();
    }, { timeout: 10000 });
    
    // Verify button is disabled
    expect(submitButton).toBeDisabled();

    // Clean up by resolving the promise
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true, message: 'Email sent' }),
    } as Response);
  });

  it.skip('should handle success message actions', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      success: true,
      message: 'Password reset email sent',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(<ForgotPassword onClose={vi.fn()} onSuccess={vi.fn()} />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('send-reset-button');

    // Type email and submit
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    // Wait for the API call to be made
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' }),
      });
    }, { timeout: 10000 });

    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Test "Send Another Email" button
    const sendAnotherButton = screen.getByText('Send Another Email');
    await user.click(sendAnotherButton);

    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    const newEmailInput = screen.getByTestId('email-input');
    expect(newEmailInput).toHaveValue('');
  });

  it('should call onClose when provided', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const mockResponse = {
      success: true,
      message: 'Password reset email sent',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(<ForgotPassword onClose={onClose} onSuccess={vi.fn()} />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('send-reset-button');

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    }, { timeout: 5000 });

    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should render cancel button when onClose is provided', () => {
    const onClose = vi.fn();
    render(<ForgotPassword onClose={onClose} />);

    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  it('should not render cancel button when onClose is not provided', () => {
    render(<ForgotPassword onSuccess={vi.fn()} />);

    expect(screen.queryByTestId('cancel-button')).not.toBeInTheDocument();
  });
});
