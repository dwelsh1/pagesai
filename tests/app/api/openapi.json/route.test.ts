import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import { GET } from '../../../../app/api/openapi.json/route';

// Mock the openapi module
vi.mock('@/lib/openapi', () => ({
  openApiSpec: {
    openapi: '3.1.0',
    info: {
      title: 'PagesAI API',
      version: '1.0.0',
    },
    paths: {
      '/api/auth/login': {
        post: {
          summary: 'User Login',
        },
      },
    },
  },
}));

describe('OpenAPI Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return OpenAPI specification successfully', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');
    expect(data).toEqual({
      openapi: '3.1.0',
      info: {
        title: 'PagesAI API',
        version: '1.0.0',
      },
      paths: {
        '/api/auth/login': {
          post: {
            summary: 'User Login',
          },
        },
      },
    });
  });
});
