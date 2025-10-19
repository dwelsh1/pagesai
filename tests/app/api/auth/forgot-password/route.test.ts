import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../../../../../app/api/auth/forgot-password/route';

// Mock the server auth module
vi.mock('@/server/auth', () => ({
  requestPasswordReset: vi.fn(),
}));

// Mock the auth validators
vi.mock('@/lib/validators/auth', () => ({
  forgotPasswordSchema: {
    parse: vi.fn(),
  },
}));

import { requestPasswordReset } from '@/server/auth';
import { forgotPasswordSchema } from '@/lib/validators/auth';

describe('Forgot Password API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful password reset request', async () => {
    const mockResult = {
      success: true,
      message: 'Password reset email sent',
    };

    vi.mocked(forgotPasswordSchema.parse).mockReturnValue({
      email: 'test@example.com',
    });

    vi.mocked(requestPasswordReset).mockResolvedValue(mockResult);

    const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Password reset email sent');
    expect(requestPasswordReset).toHaveBeenCalledWith('test@example.com');
  });

  it('should handle email not found error', async () => {
    vi.mocked(forgotPasswordSchema.parse).mockReturnValue({
      email: 'nonexistent@example.com',
    });

    vi.mocked(requestPasswordReset).mockRejectedValue(new Error('Email not found'));

    const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Email not found');
  });

  it('should handle validation errors', async () => {
    vi.mocked(forgotPasswordSchema.parse).mockImplementation(() => {
      throw new Error('Invalid email address');
    });

    const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid email address');
  });

  it('should handle internal server errors', async () => {
    vi.mocked(forgotPasswordSchema.parse).mockReturnValue({
      email: 'test@example.com',
    });

    vi.mocked(requestPasswordReset).mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  it('should handle generic errors', async () => {
    vi.mocked(forgotPasswordSchema.parse).mockReturnValue({
      email: 'test@example.com',
    });

    vi.mocked(requestPasswordReset).mockRejectedValue(new Error('Generic error'));

    const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Generic error');
  });
});
