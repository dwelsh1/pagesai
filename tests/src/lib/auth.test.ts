import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  encrypt,
  decrypt,
  createSession,
  updateSession,
  deleteSession,
} from '@/lib/auth';

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

// Mock jose
vi.mock('jose', () => ({
  SignJWT: vi.fn().mockImplementation(() => ({
    setProtectedHeader: vi.fn().mockReturnThis(),
    setIssuedAt: vi.fn().mockReturnThis(),
    setExpirationTime: vi.fn().mockReturnThis(),
    sign: vi.fn().mockResolvedValue('mock-jwt-token'),
  })),
  jwtVerify: vi.fn(),
}));

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

describe('Auth Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('encrypt', () => {
    it('should encrypt a JWT payload', async () => {
      const payload = {
        userId: 'user123',
        username: 'testuser',
        iat: Date.now(),
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };

      const result = await encrypt(payload);

      expect(result).toBe('mock-jwt-token');
      expect(SignJWT).toHaveBeenCalledWith(payload);
    });
  });

  describe('decrypt', () => {
    it('should decrypt a valid JWT token', async () => {
      const mockPayload = {
        userId: 'user123',
        username: 'testuser',
        iat: Date.now(),
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };

        vi.mocked(jwtVerify).mockResolvedValue({
          payload: mockPayload,
          protectedHeader: { alg: 'HS256' },
        } as any);

      const result = await decrypt('valid-token');

      expect(result).toEqual(mockPayload);
      expect(jwtVerify).toHaveBeenCalledTimes(1);
      expect(jwtVerify).toHaveBeenCalledWith(
        'valid-token',
        expect.any(Object),
        { algorithms: ['HS256'] }
      );
    });

    it('should return null for invalid JWT token', async () => {
      vi.mocked(jwtVerify).mockRejectedValue(new Error('Invalid token'));

      const result = await decrypt('invalid-token');

      expect(result).toBeNull();
    });

    it('should return null for empty token', async () => {
      const result = await decrypt('');

      expect(result).toBeNull();
    });
  });

  describe('createSession', () => {
    it('should create a session cookie', async () => {
      const mockCookieStore = {
        set: vi.fn(),
      };
      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      await createSession('user123', 'testuser');

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'session',
        'mock-jwt-token',
        {
          httpOnly: true,
          secure: false, // NODE_ENV is not production in test
          expires: expect.any(Date),
          sameSite: 'lax',
          path: '/',
        }
      );
    });
  });

  describe('updateSession', () => {
    it('should update session cookie', async () => {
      const mockRequest = {
        cookies: {
          get: vi.fn().mockReturnValue({ value: 'existing-token' }),
        },
      } as any;

      const mockNextResponse = {
        cookies: {
          set: vi.fn(),
        },
      };

        vi.mocked(jwtVerify).mockResolvedValue({
          payload: {
            userId: 'user123',
            username: 'testuser',
            iat: Date.now(),
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
          },
          protectedHeader: { alg: 'HS256' },
        } as any);

      // Mock NextResponse.next
      const mockNext = vi.fn().mockReturnValue(mockNextResponse);
      vi.doMock('next/server', () => ({
        NextResponse: {
          next: mockNext,
        },
      }));

      const result = await updateSession(mockRequest);

      expect(result).toBeDefined();
    });

    it('should return undefined if no session cookie', async () => {
      const mockRequest = {
        cookies: {
          get: vi.fn().mockReturnValue(undefined),
        },
      } as any;

      const result = await updateSession(mockRequest);

      expect(result).toBeUndefined();
    });
  });

  describe('deleteSession', () => {
    it('should delete session cookie', async () => {
      const mockCookieStore = {
        delete: vi.fn(),
      };
      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      await deleteSession();

      expect(mockCookieStore.delete).toHaveBeenCalledWith('session');
    });
  });
});
