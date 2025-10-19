import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUser, requestPasswordReset, resetPasswordWithToken } from '@/server/auth';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';

// Mock external modules
vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/password', () => ({
  hashPassword: vi.fn(),
}));

describe('Server Auth Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const mockUser = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
      };

      vi.mocked(db.user.findUnique).mockResolvedValue(null); // No existing user
      vi.mocked(hashPassword).mockResolvedValue('hashedpassword');
      vi.mocked(db.user.create).mockResolvedValue(mockUser);

      const result = await createUser('testuser', 'password123', 'test@example.com');

      expect(result).toEqual(mockUser);
      expect(db.user.findUnique).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(db.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(hashPassword).toHaveBeenCalledWith('password123');
      expect(db.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          password: 'hashedpassword',
          email: 'test@example.com',
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });
    });

    it('should create user without email', async () => {
      const mockUser = {
        id: 'user123',
        username: 'testuser',
        email: null,
        createdAt: new Date(),
      };

      vi.mocked(db.user.findUnique).mockResolvedValue(null);
      vi.mocked(hashPassword).mockResolvedValue('hashedpassword');
      vi.mocked(db.user.create).mockResolvedValue(mockUser);

      const result = await createUser('testuser', 'password123');

      expect(result).toEqual(mockUser);
      expect(db.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          password: 'hashedpassword',
          email: null,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });
    });

    it('should throw error if username already exists', async () => {
      const existingUser = {
        id: 'existing123',
        username: 'testuser',
        email: 'existing@example.com',
        createdAt: new Date(),
      };

      vi.mocked(db.user.findUnique).mockResolvedValue(existingUser);

      await expect(createUser('testuser', 'password123', 'test@example.com'))
        .rejects.toThrow('Username already exists');

      expect(db.user.findUnique).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(db.user.create).not.toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      const existingUser = {
        id: 'existing123',
        username: 'existinguser',
        email: 'test@example.com',
        createdAt: new Date(),
      };

      vi.mocked(db.user.findUnique)
        .mockResolvedValueOnce(null) // Username check passes
        .mockResolvedValueOnce(existingUser); // Email check fails

      await expect(createUser('testuser', 'password123', 'test@example.com'))
        .rejects.toThrow('Email already exists');

      expect(db.user.findUnique).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(db.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(db.user.create).not.toHaveBeenCalled();
    });
  });

  describe('requestPasswordReset', () => {
    it('should request password reset successfully', async () => {
      const mockUser = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
      };

      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser);

      const result = await requestPasswordReset('test@example.com');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Password reset email sent');
      expect(db.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });

    it('should throw error if email not found', async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      await expect(requestPasswordReset('nonexistent@example.com'))
        .rejects.toThrow('Email not found');

      expect(db.user.findUnique).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
    });
  });

  describe('resetPasswordWithToken', () => {
    it('should reset password successfully', async () => {
      const mockUser = {
        id: 'user123',
        username: 'testuser',
        email: 'admin@example.com',
        createdAt: new Date(),
      };

      vi.mocked(db.user.findFirst).mockResolvedValue(mockUser);
      vi.mocked(hashPassword).mockResolvedValue('newhashedpassword');
      vi.mocked(db.user.update).mockResolvedValue(mockUser);

      const result = await resetPasswordWithToken('valid-token-123', 'newpassword123');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Password reset successfully');
      expect(db.user.findFirst).toHaveBeenCalledWith({ where: { email: 'admin@example.com' } });
      expect(hashPassword).toHaveBeenCalledWith('newpassword123');
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: { password: 'newhashedpassword' },
      });
    });

    it('should throw error for invalid token', async () => {
      await expect(resetPasswordWithToken('short', 'newpassword123'))
        .rejects.toThrow('Invalid or expired token');

      expect(db.user.findFirst).not.toHaveBeenCalled();
    });

    it('should throw error for empty token', async () => {
      await expect(resetPasswordWithToken('', 'newpassword123'))
        .rejects.toThrow('Invalid or expired token');

      expect(db.user.findFirst).not.toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      vi.mocked(db.user.findFirst).mockResolvedValue(null);

      await expect(resetPasswordWithToken('valid-token-123', 'newpassword123'))
        .rejects.toThrow('Invalid or expired token');

      expect(db.user.findFirst).toHaveBeenCalledWith({ where: { email: 'admin@example.com' } });
      expect(db.user.update).not.toHaveBeenCalled();
    });
  });
});
