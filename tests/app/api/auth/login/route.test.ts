import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../../../../../app/api/auth/login/route';

// Mock the auth module
vi.mock('@/server/auth', () => ({
  authenticateUser: vi.fn(),
}));

// Mock the auth utilities
vi.mock('@/lib/auth', () => ({
  createSession: vi.fn(),
}));

// Mock the validators
vi.mock('@/lib/validators/auth', () => ({
  loginSchema: {
    parse: vi.fn(),
  },
}));

import { authenticateUser } from '@/server/auth';
import { createSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validators/auth';

describe('Login API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful login', async () => {
    const mockUser = {
      id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
    };

    vi.mocked(loginSchema.parse).mockReturnValue({
      username: 'testuser',
      password: 'password123',
    });
    vi.mocked(authenticateUser).mockResolvedValue(mockUser);
    vi.mocked(createSession).mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toEqual(mockUser);
    expect(loginSchema.parse).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
    expect(authenticateUser).toHaveBeenCalledWith('testuser', 'password123');
    expect(createSession).toHaveBeenCalledWith('user123', 'testuser');
  });

  it('should handle invalid credentials', async () => {
    vi.mocked(loginSchema.parse).mockReturnValue({
      username: 'testuser',
      password: 'wrongpassword',
    });
    vi.mocked(authenticateUser).mockRejectedValue(
      new Error('Invalid credentials')
    );

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'wrongpassword',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid credentials');
  });

  it('should handle validation errors', async () => {
    const validationError = new Error('Validation failed');
    vi.mocked(loginSchema.parse).mockImplementation(() => {
      throw validationError;
    });

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: '',
        password: '',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
  });

  it('should handle unexpected errors', async () => {
    vi.mocked(loginSchema.parse).mockReturnValue({
      username: 'testuser',
      password: 'password123',
    });
    vi.mocked(authenticateUser).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Database error');
  });

  it('should handle non-Error exceptions', async () => {
    vi.mocked(loginSchema.parse).mockReturnValue({
      username: 'testuser',
      password: 'password123',
    });
    vi.mocked(authenticateUser).mockRejectedValue('String error');

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
