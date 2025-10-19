import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginSchema, registerSchema } from '@/lib/validators/auth';

describe('Auth Validators', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        username: 'testuser',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject empty username', () => {
      const invalidData = {
        username: '',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Username is required');
      }
    });

    it('should reject empty password', () => {
      const invalidData = {
        username: 'testuser',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required');
      }
    });

    it('should reject missing username', () => {
      const invalidData = {
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Invalid input: expected string, received undefined'
        );
      }
    });

    it('should reject missing password', () => {
      const invalidData = {
        username: 'testuser',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Invalid input: expected string, received undefined'
        );
      }
    });

    it('should reject non-string username', () => {
      const invalidData = {
        username: 123,
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject non-string password', () => {
      const invalidData = {
        username: 'testuser',
        password: 123,
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        username: 'newuser',
        password: 'password123',
        email: 'user@example.com',
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate registration data without email', () => {
      const validData = {
        username: 'newuser',
        password: 'password123',
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject username shorter than 3 characters', () => {
      const invalidData = {
        username: 'ab',
        password: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Username must be at least 3 characters'
        );
      }
    });

    it('should reject password shorter than 6 characters', () => {
      const invalidData = {
        username: 'newuser',
        password: '12345',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password must be at least 6 characters'
        );
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        username: 'newuser',
        password: 'password123',
        email: 'invalid-email',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.uk',
        'user+tag@example.org',
      ];

      validEmails.forEach(email => {
        const validData = {
          username: 'newuser',
          password: 'password123',
          email,
        };

        const result = registerSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });
});
