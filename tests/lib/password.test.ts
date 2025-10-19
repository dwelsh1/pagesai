import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/password';

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

import bcrypt from 'bcryptjs';

describe('Password Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password with cost factor 12', async () => {
      const mockHash = 'hashed_password_123';
      vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as never);

      const result = await hashPassword('testpassword');

      expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 12);
      expect(result).toBe(mockHash);
    });

    it('should handle empty password', async () => {
      const mockHash = 'hashed_empty_password';
      vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as never);

      const result = await hashPassword('');

      expect(bcrypt.hash).toHaveBeenCalledWith('', 12);
      expect(result).toBe(mockHash);
    });

    it('should handle special characters in password', async () => {
      const specialPassword = 'p@ssw0rd!#$%';
      const mockHash = 'hashed_special_password';
      vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as never);

      const result = await hashPassword(specialPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(specialPassword, 12);
      expect(result).toBe(mockHash);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for valid password', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result = await verifyPassword('testpassword', 'hashed_password');

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'testpassword',
        'hashed_password'
      );
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const result = await verifyPassword('wrongpassword', 'hashed_password');

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashed_password'
      );
      expect(result).toBe(false);
    });

    it('should handle empty password', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const result = await verifyPassword('', 'hashed_password');

      expect(bcrypt.compare).toHaveBeenCalledWith('', 'hashed_password');
      expect(result).toBe(false);
    });

    it('should handle empty hash', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const result = await verifyPassword('testpassword', '');

      expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', '');
      expect(result).toBe(false);
    });
  });
});
