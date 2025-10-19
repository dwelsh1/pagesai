import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

export const loginSchema = z
  .object({
    username: z.string().min(1, 'Username is required').openapi({
      description: 'User login identifier',
      example: 'testuser',
    }),
    password: z.string().min(1, 'Password is required').openapi({
      description: 'User password',
      example: 'password123',
    }),
  })
  .openapi({
    title: 'Login Request',
    description: 'User login credentials',
  });

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .openapi({
        description: 'Unique username for the account',
        example: 'newuser',
      }),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .openapi({
        description: 'Secure password for the account',
        example: 'securepassword123',
      }),
    email: z
      .string()
      .optional()
      .refine((val) => !val || z.string().email().safeParse(val).success, {
        message: 'Invalid email address',
      })
      .openapi({
        description: 'Optional email address for the account',
        example: 'user@example.com',
      }),
  })
  .openapi({
    title: 'Registration Request',
    description: 'New user registration data',
  });

export const forgotPasswordSchema = z
  .object({
    email: z.string().email('Invalid email address').openapi({
      description: 'Email address to send password reset to',
      example: 'user@example.com',
    }),
  })
  .openapi({
    title: 'Forgot Password Request',
    description: 'Request password reset for user account',
  });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required').openapi({
      description: 'Password reset token',
      example: 'abc123def456',
    }),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .openapi({
        description: 'New password for the account',
        example: 'newpassword123',
      }),
  })
  .openapi({
    title: 'Reset Password Request',
    description: 'Reset password with token',
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
