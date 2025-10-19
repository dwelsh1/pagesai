import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../../../../../app/api/auth/register/route';

// Mock the server auth module
vi.mock('@/server/auth', () => ({
  createUser: vi.fn(),
}));

// Mock the auth validators
vi.mock('@/lib/validators/auth', () => ({
  registerSchema: {
    parse: vi.fn(),
  },
}));

import { createUser } from '@/server/auth';
import { registerSchema } from '@/lib/validators/auth';

describe('Register API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful registration', async () => {
    const mockUser = {
      id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      createdAt: new Date(),
    };

    vi.mocked(registerSchema.parse).mockReturnValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    vi.mocked(createUser).mockResolvedValue(mockUser);

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.user).toEqual({
      id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
    });
    expect(createUser).toHaveBeenCalledWith('testuser', 'password123', 'test@example.com');
  });

  it('should handle username already exists error', async () => {
    vi.mocked(registerSchema.parse).mockReturnValue({
      username: 'existinguser',
      password: 'password123',
    });

    vi.mocked(createUser).mockRejectedValue(new Error('Username already exists'));

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'existinguser',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe('Username already exists');
  });

  it('should handle email already exists error', async () => {
    vi.mocked(registerSchema.parse).mockReturnValue({
      username: 'testuser',
      email: 'existing@example.com',
      password: 'password123',
    });

    vi.mocked(createUser).mockRejectedValue(new Error('Email already exists'));

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe('Email already exists');
  });

  it('should handle validation errors', async () => {
    vi.mocked(registerSchema.parse).mockImplementation(() => {
      throw new Error('Validation error');
    });

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'ab', // Too short
        password: '123', // Too short
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('should handle internal server errors', async () => {
    vi.mocked(registerSchema.parse).mockReturnValue({
      username: 'testuser',
      password: 'password123',
    });

    vi.mocked(createUser).mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
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

  it('should handle registration without email', async () => {
    const mockUser = {
      id: 'user123',
      username: 'testuser',
      email: null,
      createdAt: new Date(),
    };

    vi.mocked(registerSchema.parse).mockReturnValue({
      username: 'testuser',
      password: 'password123',
    });

    vi.mocked(createUser).mockResolvedValue(mockUser);

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.user.email).toBeNull();
    expect(createUser).toHaveBeenCalledWith('testuser', 'password123', undefined);
  });
});
