import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../../../../../app/api/auth/reset-password/route';

// Mock the server auth module
vi.mock('@/server/auth', () => ({
  resetPasswordWithToken: vi.fn(),
}));

// Mock the auth validators
vi.mock('@/lib/validators/auth', () => ({
  resetPasswordSchema: {
    parse: vi.fn(),
  },
}));

import { resetPasswordWithToken } from '@/server/auth';
import { resetPasswordSchema } from '@/lib/validators/auth';

describe('Reset Password API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful password reset', async () => {
    const mockResult = {
      success: true,
      message: 'Password reset successfully',
    };

    vi.mocked(resetPasswordSchema.parse).mockReturnValue({
      token: 'valid-token-123',
      password: 'newpassword123',
    });

    vi.mocked(resetPasswordWithToken).mockResolvedValue(mockResult);

    const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'valid-token-123',
        password: 'newpassword123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Password reset successfully');
    expect(resetPasswordWithToken).toHaveBeenCalledWith('valid-token-123', 'newpassword123');
  });

  it('should handle invalid token error', async () => {
    vi.mocked(resetPasswordSchema.parse).mockReturnValue({
      token: 'invalid-token',
      password: 'newpassword123',
    });

    vi.mocked(resetPasswordWithToken).mockRejectedValue(new Error('Invalid or expired token'));

    const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'invalid-token',
        password: 'newpassword123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid or expired token');
  });

  it('should handle validation errors', async () => {
    vi.mocked(resetPasswordSchema.parse).mockImplementation(() => {
      throw new Error('Password must be at least 6 characters');
    });

    const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'valid-token-123',
        password: '123', // Too short
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Password must be at least 6 characters');
  });

  it('should handle internal server errors', async () => {
    vi.mocked(resetPasswordSchema.parse).mockReturnValue({
      token: 'valid-token-123',
      password: 'newpassword123',
    });

    vi.mocked(resetPasswordWithToken).mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'valid-token-123',
        password: 'newpassword123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  it('should handle generic errors', async () => {
    vi.mocked(resetPasswordSchema.parse).mockReturnValue({
      token: 'valid-token-123',
      password: 'newpassword123',
    });

    vi.mocked(resetPasswordWithToken).mockRejectedValue(new Error('Generic error'));

    const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'valid-token-123',
        password: 'newpassword123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Generic error');
  });

  it('should handle missing token', async () => {
    vi.mocked(resetPasswordSchema.parse).mockImplementation(() => {
      throw new Error('Reset token is required');
    });

    const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        password: 'newpassword123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Reset token is required');
  });
});
