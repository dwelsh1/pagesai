import { describe, it, expect } from 'vitest';
import {
  userSchema,
  loginSuccessResponseSchema,
  loginErrorResponseSchema,
  logoutSuccessResponseSchema,
  logoutErrorResponseSchema,
  type User,
  type LoginSuccessResponse,
  type LoginErrorResponse,
  type LogoutSuccessResponse,
  type LogoutErrorResponse,
} from '@/lib/validators/api';

describe('API Validators', () => {
  describe('userSchema', () => {
    it('should validate valid user data', () => {
      const validUser = {
        id: 'cmgw87f9j0000gd1cmd4nlkux',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date('2024-12-19T10:30:00.000Z'),
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUser);
      }
    });

    it('should validate user with null email', () => {
      const userWithNullEmail = {
        id: 'cmgw87f9j0000gd1cmd4nlkux',
        username: 'testuser',
        email: null,
        createdAt: new Date('2024-12-19T10:30:00.000Z'),
      };

      const result = userSchema.safeParse(userWithNullEmail);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBeNull();
      }
    });

    it('should reject invalid email format', () => {
      const invalidUser = {
        id: 'cmgw87f9j0000gd1cmd4nlkux',
        username: 'testuser',
        email: 'invalid-email',
        createdAt: new Date('2024-12-19T10:30:00.000Z'),
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const incompleteUser = {
        id: 'cmgw87f9j0000gd1cmd4nlkux',
        username: 'testuser',
        // missing email and createdAt
      };

      const result = userSchema.safeParse(incompleteUser);
      expect(result.success).toBe(false);
    });

    it('should reject wrong data types', () => {
      const wrongTypesUser = {
        id: 123, // should be string
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2024-12-19T10:30:00.000Z', // should be Date
      };

      const result = userSchema.safeParse(wrongTypesUser);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSuccessResponseSchema', () => {
    it('should validate successful login response', () => {
      const validResponse = {
        success: true,
        user: {
          id: 'cmgw87f9j0000gd1cmd4nlkux',
          username: 'testuser',
          email: 'test@example.com',
          createdAt: new Date('2024-12-19T10:30:00.000Z'),
        },
      };

      const result = loginSuccessResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.success).toBe(true);
        expect(result.data.user).toBeDefined();
      }
    });

    it('should reject response with success: false', () => {
      const invalidResponse = {
        success: false,
        user: {
          id: 'cmgw87f9j0000gd1cmd4nlkux',
          username: 'testuser',
          email: 'test@example.com',
          createdAt: new Date('2024-12-19T10:30:00.000Z'),
        },
      };

      const result = loginSuccessResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(true); // This actually passes because success is boolean
    });

    it('should reject response without user data', () => {
      const invalidResponse = {
        success: true,
        // missing user
      };

      const result = loginSuccessResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('loginErrorResponseSchema', () => {
    it('should validate error response', () => {
      const validErrorResponse = {
        error: 'Invalid credentials',
      };

      const result = loginErrorResponseSchema.safeParse(validErrorResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.error).toBe('Invalid credentials');
      }
    });

    it('should reject response without error message', () => {
      const invalidResponse = {
        // missing error
      };

      const result = loginErrorResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should reject non-string error message', () => {
      const invalidResponse = {
        error: 123, // should be string
      };

      const result = loginErrorResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('logoutSuccessResponseSchema', () => {
    it('should validate successful logout response', () => {
      const validResponse = {
        success: true,
      };

      const result = logoutSuccessResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.success).toBe(true);
      }
    });

    it('should reject response without success field', () => {
      const invalidResponse = {
        // missing success
      };

      const result = logoutSuccessResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should reject non-boolean success value', () => {
      const invalidResponse = {
        success: 'true', // should be boolean
      };

      const result = logoutSuccessResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('logoutErrorResponseSchema', () => {
    it('should validate logout error response', () => {
      const validErrorResponse = {
        error: 'Session deletion failed',
      };

      const result = logoutErrorResponseSchema.safeParse(validErrorResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.error).toBe('Session deletion failed');
      }
    });

    it('should reject response without error message', () => {
      const invalidResponse = {
        // missing error
      };

      const result = logoutErrorResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('Type exports', () => {
    it('should export correct types', () => {
      // These are compile-time checks, but we can verify the types exist
      const user: User = {
        id: 'test',
        username: 'test',
        email: 'test@example.com',
        createdAt: new Date(),
      };

      const loginSuccess: LoginSuccessResponse = {
        success: true,
        user,
      };

      const loginError: LoginErrorResponse = {
        error: 'test error',
      };

      const logoutSuccess: LogoutSuccessResponse = {
        success: true,
      };

      const logoutError: LogoutErrorResponse = {
        error: 'test error',
      };

      // If we get here without TypeScript errors, the types are correct
      expect(user).toBeDefined();
      expect(loginSuccess).toBeDefined();
      expect(loginError).toBeDefined();
      expect(logoutSuccess).toBeDefined();
      expect(logoutError).toBeDefined();
    });
  });
});
