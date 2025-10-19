import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from './validators/auth';
import {
  loginSuccessResponseSchema,
  loginErrorResponseSchema,
  logoutSuccessResponseSchema,
  logoutErrorResponseSchema,
  registerSuccessResponseSchema,
  registerErrorResponseSchema,
  forgotPasswordSuccessResponseSchema,
  forgotPasswordErrorResponseSchema,
  resetPasswordSuccessResponseSchema,
  resetPasswordErrorResponseSchema,
} from './validators/api';

// Create OpenAPI registry
const registry = new OpenAPIRegistry();

// Define API info
registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  description: 'Authenticate user and create session',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: loginSuccessResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation error or invalid credentials',
      content: {
        'application/json': {
          schema: loginErrorResponseSchema,
        },
      },
    },
    401: {
      description: 'Invalid credentials',
      content: {
        'application/json': {
          schema: loginErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: loginErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/logout',
  description: 'Terminate user session',
  tags: ['Authentication'],
  responses: {
    200: {
      description: 'Logout successful',
      content: {
        'application/json': {
          schema: logoutSuccessResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: logoutErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  description: 'Create new user account',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Registration successful',
      content: {
        'application/json': {
          schema: registerSuccessResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: registerErrorResponseSchema,
        },
      },
    },
    409: {
      description: 'Username or email already exists',
      content: {
        'application/json': {
          schema: registerErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: registerErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/forgot-password',
  description: 'Request password reset for user account',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: forgotPasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset request successful',
      content: {
        'application/json': {
          schema: forgotPasswordSuccessResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: forgotPasswordErrorResponseSchema,
        },
      },
    },
    404: {
      description: 'Email not found',
      content: {
        'application/json': {
          schema: forgotPasswordErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: forgotPasswordErrorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/reset-password',
  description: 'Reset password with token',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: resetPasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Password reset successful',
      content: {
        'application/json': {
          schema: resetPasswordSuccessResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation error or invalid token',
      content: {
        'application/json': {
          schema: resetPasswordErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: resetPasswordErrorResponseSchema,
        },
      },
    },
  },
});

// Generate OpenAPI specification
const generator = new OpenApiGeneratorV31(registry.definitions);

export const openApiSpec = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'PagesAI API',
    description: 'Authentication API for PagesAI application',
    version: '1.0.0',
    contact: {
      name: 'PagesAI Team',
      email: 'support@pagesai.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and session management',
    },
  ],
});
