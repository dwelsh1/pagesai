import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUser, authenticateUser } from '@/server/auth';

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock auth utilities
vi.mock('@/lib/auth', () => ({
  decrypt: vi.fn(),
}));

// Mock password utilities
vi.mock('@/lib/password', () => ({
  verifyPassword: vi.fn(),
}));

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

import { db } from '@/lib/db';
import { decrypt } from '@/lib/auth';
import { verifyPassword } from '@/lib/password';
import { cookies } from 'next/headers';

describe('Server Auth Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user when valid session exists', async () => {
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({ value: 'valid-session' }),
      };
      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const mockPayload = {
        userId: 'user123',
        username: 'testuser',
        iat: Date.now(),
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      vi.mocked(decrypt).mockResolvedValue(mockPayload);

      const mockUser = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser);

      const result = await getUser();

      expect(result).toEqual(mockUser);
      expect(decrypt).toHaveBeenCalledWith('valid-session');
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user123' },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });
    });

    it('should return null when no session cookie', async () => {
      const mockCookieStore = {
        get: vi.fn().mockReturnValue(undefined),
      };
      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const result = await getUser();

      expect(result).toBeNull();
      expect(decrypt).not.toHaveBeenCalled();
    });

    it('should return null when session is invalid', async () => {
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({ value: 'invalid-session' }),
      };
      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      vi.mocked(decrypt).mockResolvedValue(null);

      const result = await getUser();

      expect(result).toBeNull();
      expect(db.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({ value: 'valid-session' }),
      };
      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const mockPayload = {
        userId: 'user123',
        username: 'testuser',
        iat: Date.now(),
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      vi.mocked(decrypt).mockResolvedValue(mockPayload);
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      const result = await getUser();

      expect(result).toBeNull();
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate valid user', async () => {
      const mockUser = {
        id: 'user123',
        username: 'testuser',
        password: 'hashed-password',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(verifyPassword).mockResolvedValue(true);

      const result = await authenticateUser('testuser', 'password123');

      expect(result).toEqual({
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(verifyPassword).toHaveBeenCalledWith(
        'password123',
        'hashed-password'
      );
    });

    it('should throw error for non-existent user', async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      await expect(
        authenticateUser('nonexistent', 'password123')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
      const mockUser = {
        id: 'user123',
        username: 'testuser',
        password: 'hashed-password',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(verifyPassword).mockResolvedValue(false);

      await expect(
        authenticateUser('testuser', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
