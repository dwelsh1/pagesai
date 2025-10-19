import { describe, it, expect } from 'vitest';
import { openApiSpec } from '@/lib/openapi';

describe('OpenAPI Utility', () => {
  it('should generate valid OpenAPI 3.1 specification', () => {
    expect(openApiSpec).toBeDefined();
    expect(openApiSpec.openapi).toBe('3.1.0');
    expect(openApiSpec.info).toBeDefined();
    expect(openApiSpec.info.title).toBe('PagesAI API');
    expect(openApiSpec.info.description).toBe('Authentication API for PagesAI application');
    expect(openApiSpec.info.version).toBe('1.0.0');
  });

  it('should include contact information', () => {
    expect(openApiSpec.info.contact).toBeDefined();
    expect(openApiSpec.info.contact?.name).toBe('PagesAI Team');
    expect(openApiSpec.info.contact?.email).toBe('support@pagesai.com');
  });

  it('should include server configuration', () => {
    expect(openApiSpec.servers).toBeDefined();
    expect(openApiSpec.servers).toHaveLength(1);
    expect(openApiSpec.servers?.[0]?.url).toBe('http://localhost:3000');
    expect(openApiSpec.servers?.[0]?.description).toBe('Development server');
  });

  it('should include tags configuration', () => {
    expect(openApiSpec.tags).toBeDefined();
    expect(openApiSpec.tags).toHaveLength(1);
    expect(openApiSpec.tags?.[0]?.name).toBe('Authentication');
    expect(openApiSpec.tags?.[0]?.description).toBe('User authentication and session management');
  });

  it('should include login endpoint', () => {
    expect(openApiSpec.paths).toBeDefined();
    expect(openApiSpec.paths?.['/api/auth/login']).toBeDefined();
    
    const loginPath = openApiSpec.paths?.['/api/auth/login'];
    expect(loginPath?.post).toBeDefined();
    expect(loginPath?.post?.description).toBe('Authenticate user and create session');
    expect(loginPath?.post?.tags).toContain('Authentication');
  });

  it('should include logout endpoint', () => {
    expect(openApiSpec.paths?.['/api/auth/logout']).toBeDefined();
    
    const logoutPath = openApiSpec.paths?.['/api/auth/logout'];
    expect(logoutPath?.post).toBeDefined();
    expect(logoutPath?.post?.description).toBe('Terminate user session');
    expect(logoutPath?.post?.tags).toContain('Authentication');
  });

  it('should include login endpoint with proper structure', () => {
    const loginPath = openApiSpec.paths?.['/api/auth/login'];
    expect(loginPath?.post).toBeDefined();
    expect(loginPath?.post?.description).toBe('Authenticate user and create session');
    expect(loginPath?.post?.tags).toContain('Authentication');
    expect(loginPath?.post?.responses).toBeDefined();
  });

  it('should include response schemas for login endpoint', () => {
    const loginPath = openApiSpec.paths?.['/api/auth/login'];
    const responses = loginPath?.post?.responses;
    
    expect(responses?.['200']).toBeDefined();
    expect(responses?.['200']?.description).toBe('Login successful');
    expect(responses?.['400']).toBeDefined();
    expect(responses?.['400']?.description).toBe('Validation error or invalid credentials');
    expect(responses?.['401']).toBeDefined();
    expect(responses?.['401']?.description).toBe('Invalid credentials');
    expect(responses?.['500']).toBeDefined();
    expect(responses?.['500']?.description).toBe('Internal server error');
  });

  it('should include response schemas for logout endpoint', () => {
    const logoutPath = openApiSpec.paths?.['/api/auth/logout'];
    const responses = logoutPath?.post?.responses;
    
    expect(responses?.['200']).toBeDefined();
    expect(responses?.['200']?.description).toBe('Logout successful');
    expect(responses?.['500']).toBeDefined();
    expect(responses?.['500']?.description).toBe('Internal server error');
  });

  it('should have proper content types for responses', () => {
    const loginPath = openApiSpec.paths?.['/api/auth/login'];
    const responses = loginPath?.post?.responses;
    
    if (responses) {
      Object.values(responses).forEach(response => {
        expect(response?.content).toBeDefined();
        expect(response?.content?.['application/json']).toBeDefined();
        expect(response?.content?.['application/json']?.schema).toBeDefined();
      });
    }
  });

  it('should be a valid OpenAPI object structure', () => {
    // Check required OpenAPI fields
    expect(openApiSpec.openapi).toBeDefined();
    expect(openApiSpec.info).toBeDefined();
    expect(openApiSpec.paths).toBeDefined();
    
    // Check info object structure
    expect(openApiSpec.info.title).toBeDefined();
    expect(openApiSpec.info.version).toBeDefined();
    
    // Check paths object structure
    expect(typeof openApiSpec.paths).toBe('object');
    if (openApiSpec.paths) {
      expect(Object.keys(openApiSpec.paths).length).toBeGreaterThan(0);
    }
  });
});
