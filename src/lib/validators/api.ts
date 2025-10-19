import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

// Response schemas
export const userSchema = z
  .object({
    id: z.string().openapi({
      description: 'Unique user identifier',
      example: 'cmgw87f9j0000gd1cmd4nlkux',
    }),
    username: z.string().openapi({
      description: 'User login name',
      example: 'testuser',
    }),
    email: z.string().email().nullable().openapi({
      description: 'User email address',
      example: 'test@example.com',
    }),
    createdAt: z.date().openapi({
      description: 'Account creation timestamp',
      example: '2024-12-19T10:30:00.000Z',
    }),
  })
  .openapi({
    title: 'User',
    description: 'User account information',
  });

export const loginSuccessResponseSchema = z
  .object({
    success: z.boolean().openapi({
      description: 'Indicates if the login was successful',
      example: true,
    }),
    user: userSchema.openapi({
      description: 'Authenticated user information',
    }),
  })
  .openapi({
    title: 'Login Success Response',
    description: 'Successful login response with user data',
  });

export const loginErrorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'Error message describing what went wrong',
      example: 'Invalid credentials',
    }),
  })
  .openapi({
    title: 'Login Error Response',
    description: 'Error response for failed login attempts',
  });

export const logoutSuccessResponseSchema = z
  .object({
    success: z.boolean().openapi({
      description: 'Indicates if the logout was successful',
      example: true,
    }),
  })
  .openapi({
    title: 'Logout Success Response',
    description: 'Successful logout response',
  });

export const logoutErrorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'Error message describing what went wrong',
      example: 'Internal server error',
    }),
  })
  .openapi({
    title: 'Logout Error Response',
    description: 'Error response for failed logout attempts',
  });

export const registerSuccessResponseSchema = z
  .object({
    success: z.boolean().openapi({
      description: 'Indicates if the registration was successful',
      example: true,
    }),
    user: userSchema.openapi({
      description: 'Newly created user information',
    }),
  })
  .openapi({
    title: 'Registration Success Response',
    description: 'Successful registration response with user data',
  });

export const registerErrorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'Error message describing what went wrong',
      example: 'Username already exists',
    }),
  })
  .openapi({
    title: 'Registration Error Response',
    description: 'Error response for failed registration attempts',
  });

export const forgotPasswordSuccessResponseSchema = z
  .object({
    success: z.boolean().openapi({
      description: 'Indicates if the password reset request was successful',
      example: true,
    }),
    message: z.string().openapi({
      description: 'Success message',
      example: 'Password reset email sent',
    }),
  })
  .openapi({
    title: 'Forgot Password Success Response',
    description: 'Successful password reset request response',
  });

export const forgotPasswordErrorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'Error message describing what went wrong',
      example: 'Email not found',
    }),
  })
  .openapi({
    title: 'Forgot Password Error Response',
    description: 'Error response for failed password reset requests',
  });

export const resetPasswordSuccessResponseSchema = z
  .object({
    success: z.boolean().openapi({
      description: 'Indicates if the password reset was successful',
      example: true,
    }),
    message: z.string().openapi({
      description: 'Success message',
      example: 'Password reset successfully',
    }),
  })
  .openapi({
    title: 'Reset Password Success Response',
    description: 'Successful password reset response',
  });

export const resetPasswordErrorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'Error message describing what went wrong',
      example: 'Invalid or expired token',
    }),
  })
  .openapi({
    title: 'Reset Password Error Response',
    description: 'Error response for failed password resets',
  });

// Export types
export type User = z.infer<typeof userSchema>;
export type LoginSuccessResponse = z.infer<typeof loginSuccessResponseSchema>;
export type LoginErrorResponse = z.infer<typeof loginErrorResponseSchema>;
export type LogoutSuccessResponse = z.infer<typeof logoutSuccessResponseSchema>;
export type LogoutErrorResponse = z.infer<typeof logoutErrorResponseSchema>;
export type RegisterSuccessResponse = z.infer<typeof registerSuccessResponseSchema>;
export type RegisterErrorResponse = z.infer<typeof registerErrorResponseSchema>;
export type ForgotPasswordSuccessResponse = z.infer<typeof forgotPasswordSuccessResponseSchema>;
export type ForgotPasswordErrorResponse = z.infer<typeof forgotPasswordErrorResponseSchema>;
export type ResetPasswordSuccessResponse = z.infer<typeof resetPasswordSuccessResponseSchema>;
export type ResetPasswordErrorResponse = z.infer<typeof resetPasswordErrorResponseSchema>;
