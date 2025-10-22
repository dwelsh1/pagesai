import { describe, it, expect } from 'vitest';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  registerSchema,
} from '@/lib/validators/auth';

describe('Extended Auth Validators', () => {
  describe('forgotPasswordSchema', () => {
    it('should validate a correct forgot password request', () => {
      const request = {
        email: 'test@example.com',
      };
      expect(() => forgotPasswordSchema.parse(request)).not.toThrow();
    });

    it('should invalidate an incorrect forgot password request (invalid email)', () => {
      const request = {
        email: 'invalid-email',
      };
      expect(() => forgotPasswordSchema.parse(request)).toThrow();
    });

    it('should invalidate an incorrect forgot password request (missing email)', () => {
      const request = {};
      expect(() => forgotPasswordSchema.parse(request)).toThrow();
    });

    it('should invalidate an incorrect forgot password request (empty email)', () => {
      const request = {
        email: '',
      };
      expect(() => forgotPasswordSchema.parse(request)).toThrow();
    });
  });

  describe('resetPasswordSchema', () => {
    it('should validate a correct reset password request', () => {
      const request = {
        token: 'valid-token-123',
        password: 'newpassword123',
      };
      expect(() => resetPasswordSchema.parse(request)).not.toThrow();
    });

    it('should invalidate an incorrect reset password request (missing token)', () => {
      const request = {
        password: 'newpassword123',
      };
      expect(() => resetPasswordSchema.parse(request)).toThrow();
    });

    it('should invalidate an incorrect reset password request (empty token)', () => {
      const request = {
        token: '',
        password: 'newpassword123',
      };
      expect(() => resetPasswordSchema.parse(request)).toThrow();
    });

    it('should invalidate an incorrect reset password request (missing password)', () => {
      const request = {
        token: 'valid-token-123',
      };
      expect(() => resetPasswordSchema.parse(request)).toThrow();
    });

    it('should invalidate an incorrect reset password request (password too short)', () => {
      const request = {
        token: 'valid-token-123',
        password: '123', // Too short
      };
      expect(() => resetPasswordSchema.parse(request)).toThrow();
    });

    it('should invalidate an incorrect reset password request (password exactly 5 characters)', () => {
      const request = {
        token: 'valid-token-123',
        password: '12345', // Exactly 5 characters, needs 6
      };
      expect(() => resetPasswordSchema.parse(request)).toThrow();
    });

    it('should validate a correct reset password request (password exactly 6 characters)', () => {
      const request = {
        token: 'valid-token-123',
        password: '123456', // Exactly 6 characters
      };
      expect(() => resetPasswordSchema.parse(request)).not.toThrow();
    });
  });

  describe('registerSchema', () => {
    it('should validate a correct registration request with email', () => {
      const request = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      expect(() => registerSchema.parse(request)).not.toThrow();
    });

    it('should validate a correct registration request without email', () => {
      const request = {
        username: 'testuser',
        password: 'password123',
      };
      expect(() => registerSchema.parse(request)).not.toThrow();
    });

    it('should validate a correct registration request with undefined email', () => {
      const request = {
        username: 'testuser',
        email: undefined,
        password: 'password123',
      };
      expect(() => registerSchema.parse(request)).not.toThrow();
    });

    it('should invalidate an incorrect registration request (username too short)', () => {
      const request = {
        username: 'ab', // Too short
        password: 'password123',
      };
      expect(() => registerSchema.parse(request)).toThrow();
    });

    it('should invalidate an incorrect registration request (username exactly 2 characters)', () => {
      const request = {
        username: 'ab', // Exactly 2 characters, needs 3
        password: 'password123',
      };
      expect(() => registerSchema.parse(request)).toThrow();
    });

    it('should validate a correct registration request (username exactly 3 characters)', () => {
      const request = {
        username: 'abc', // Exactly 3 characters
        password: 'password123',
      };
      expect(() => registerSchema.parse(request)).not.toThrow();
    });

    it('should invalidate an incorrect registration request (password too short)', () => {
      const request = {
        username: 'testuser',
        password: '123', // Too short
      };
      expect(() => registerSchema.parse(request)).toThrow();
    });

    it('should invalidate an incorrect registration request (password exactly 5 characters)', () => {
      const request = {
        username: 'testuser',
        password: '12345', // Exactly 5 characters, needs 6
      };
      expect(() => registerSchema.parse(request)).toThrow();
    });

    it('should validate a correct registration request (password exactly 6 characters)', () => {
      const request = {
        username: 'testuser',
        password: '123456', // Exactly 6 characters
      };
      expect(() => registerSchema.parse(request)).not.toThrow();
    });

    it('should invalidate an incorrect registration request (invalid email)', () => {
      const request = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
      };
      expect(() => registerSchema.parse(request)).toThrow();
    });

    it('should invalidate an incorrect registration request (missing username)', () => {
      const request = {
        password: 'password123',
      };
      expect(() => registerSchema.parse(request)).toThrow();
    });

    it('should invalidate an incorrect registration request (missing password)', () => {
      const request = {
        username: 'testuser',
      };
      expect(() => registerSchema.parse(request)).toThrow();
    });
  });
});
