import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useAuth } from '@/hooks/use-auth';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  it('should initialize with null user and loading state', () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should fetch user data on mount', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login successfully', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
    };

    const credentials = {
      username: 'testuser',
      password: 'password123',
    };

    // Mock login API call
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    // Mock user fetch after login
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login(credentials);
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle login failure', async () => {
    const credentials = {
      username: 'testuser',
      password: 'wrongpassword',
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    const { result } = renderHook(() => useAuth());

    await expect(
      act(async () => {
        await result.current.login(credentials);
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should handle logout successfully', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
    };

    // Initial user fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    // Mock logout API call
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(result.current.user).toBeNull();
  });

  it('should handle registration successfully', async () => {
    const mockUser = {
      id: '1',
      username: 'newuser',
      email: 'new@example.com',
    };

    const registrationData = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
    };

    // Mock registration API call
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    // Mock login after registration
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    // Mock user fetch after login
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register(registrationData);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle registration failure', async () => {
    const registrationData = {
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123',
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Username already exists' }),
    });

    const { result } = renderHook(() => useAuth());

    await expect(
      act(async () => {
        await result.current.register(registrationData);
      })
    ).rejects.toThrow('Username already exists');
  });

  it('should check auth status', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.checkAuthStatus();
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle network errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle API errors during user fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
