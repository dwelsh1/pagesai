import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../../../../../app/api/auth/logout/route';

// Mock the auth module
vi.mock('@/lib/auth', () => ({
  deleteSession: vi.fn(),
}));

import { deleteSession } from '@/lib/auth';

describe('Logout API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful logout', async () => {
    vi.mocked(deleteSession).mockResolvedValue(undefined);

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Logged out successfully');
    expect(deleteSession).toHaveBeenCalled();
  });

  it('should handle logout errors', async () => {
    vi.mocked(deleteSession).mockRejectedValue(
      new Error('Session deletion failed')
    );

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
