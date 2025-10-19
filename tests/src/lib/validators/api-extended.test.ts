import { describe, it, expect } from 'vitest';
import {
  forgotPasswordSuccessResponseSchema,
  forgotPasswordErrorResponseSchema,
  resetPasswordSuccessResponseSchema,
  resetPasswordErrorResponseSchema,
  registerSuccessResponseSchema,
  registerErrorResponseSchema,
} from '@/lib/validators/api';

describe('Extended API Validators', () => {
  describe('forgotPasswordSuccessResponseSchema', () => {
    it('should validate a correct forgot password success response', () => {
      const response = {
        success: true,
        message: 'Password reset email sent',
      };
      expect(() => forgotPasswordSuccessResponseSchema.parse(response)).not.toThrow();
    });

    it('should invalidate an incorrect forgot password success response (missing success)', () => {
      const response = {
        message: 'Password reset email sent',
      };
      expect(() => forgotPasswordSuccessResponseSchema.parse(response)).toThrow();
    });

    it('should invalidate an incorrect forgot password success response (missing message)', () => {
      const response = {
        success: true,
      };
      expect(() => forgotPasswordSuccessResponseSchema.parse(response)).toThrow();
    });
  });

  describe('forgotPasswordErrorResponseSchema', () => {
    it('should validate a correct forgot password error response', () => {
      const response = {
        error: 'Email not found',
      };
      expect(() => forgotPasswordErrorResponseSchema.parse(response)).not.toThrow();
    });

    it('should invalidate an incorrect forgot password error response (missing error message)', () => {
      const response = {};
      expect(() => forgotPasswordErrorResponseSchema.parse(response)).toThrow();
    });
  });

  describe('resetPasswordSuccessResponseSchema', () => {
    it('should validate a correct reset password success response', () => {
      const response = {
        success: true,
        message: 'Password reset successfully',
      };
      expect(() => resetPasswordSuccessResponseSchema.parse(response)).not.toThrow();
    });

    it('should invalidate an incorrect reset password success response (missing success)', () => {
      const response = {
        message: 'Password reset successfully',
      };
      expect(() => resetPasswordSuccessResponseSchema.parse(response)).toThrow();
    });

    it('should invalidate an incorrect reset password success response (missing message)', () => {
      const response = {
        success: true,
      };
      expect(() => resetPasswordSuccessResponseSchema.parse(response)).toThrow();
    });
  });

  describe('resetPasswordErrorResponseSchema', () => {
    it('should validate a correct reset password error response', () => {
      const response = {
        error: 'Invalid or expired token',
      };
      expect(() => resetPasswordErrorResponseSchema.parse(response)).not.toThrow();
    });

    it('should invalidate an incorrect reset password error response (missing error message)', () => {
      const response = {};
      expect(() => resetPasswordErrorResponseSchema.parse(response)).toThrow();
    });
  });

  describe('registerSuccessResponseSchema', () => {
    it('should validate a correct registration success response', () => {
      const response = {
        success: true,
        user: {
          id: 'cmgw87f9j0000gd1cmd4nlkux',
          username: 'testuser',
          email: 'test@example.com',
          createdAt: new Date(),
        },
      };
      expect(() => registerSuccessResponseSchema.parse(response)).not.toThrow();
    });

    it('should validate a correct registration success response with null email', () => {
      const response = {
        success: true,
        user: {
          id: 'cmgw87f9j0000gd1cmd4nlkux',
          username: 'testuser',
          email: null,
          createdAt: new Date(),
        },
      };
      expect(() => registerSuccessResponseSchema.parse(response)).not.toThrow();
    });

    it('should invalidate an incorrect registration success response (missing user)', () => {
      const response = {
        success: true,
      };
      expect(() => registerSuccessResponseSchema.parse(response)).toThrow();
    });
  });

  describe('registerErrorResponseSchema', () => {
    it('should validate a correct registration error response', () => {
      const response = {
        error: 'Username already exists',
      };
      expect(() => registerErrorResponseSchema.parse(response)).not.toThrow();
    });

    it('should validate a correct registration error response for email exists', () => {
      const response = {
        error: 'Email already exists',
      };
      expect(() => registerErrorResponseSchema.parse(response)).not.toThrow();
    });

    it('should invalidate an incorrect registration error response (missing error message)', () => {
      const response = {};
      expect(() => registerErrorResponseSchema.parse(response)).toThrow();
    });
  });
});
