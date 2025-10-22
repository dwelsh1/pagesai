import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/pages/route';

// Mock dependencies
vi.mock('@/server/auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    page: {
      findMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { getServerSession } from '@/server/auth';
import { db } from '@/lib/db';

describe('/api/pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('returns 401 when user is not authenticated', async () => {
      (getServerSession as any).mockResolvedValueOnce(null);

      const request = new NextRequest('http://localhost:3000/api/pages');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns pages for authenticated user', async () => {
      const mockUser = { id: 'user-1', username: 'testuser' };
      const mockPages = [
        { id: 'page-1', title: 'Test Page 1', userId: 'user-1' },
        { id: 'page-2', title: 'Test Page 2', userId: 'user-1' },
      ];

      (getServerSession as any).mockResolvedValueOnce({ user: mockUser });
      (db.page.findMany as any).mockResolvedValueOnce(mockPages);

      const request = new NextRequest('http://localhost:3000/api/pages');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pages).toEqual(mockPages);
      expect(db.page.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: { children: true, parent: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('handles database errors', async () => {
      const mockUser = { id: 'user-1', username: 'testuser' };
      (getServerSession as any).mockResolvedValueOnce({ user: mockUser });
      (db.page.findMany as any).mockRejectedValueOnce(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/pages');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch pages');
    });
  });

  describe('POST', () => {
    it('returns 401 when user is not authenticated', async () => {
      (getServerSession as any).mockResolvedValueOnce(null);

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test Page' }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('creates a new page for authenticated user', async () => {
      const mockUser = { id: 'user-1', username: 'testuser' };
      const mockPage = { id: 'page-1', title: 'Test Page', userId: 'user-1' };

      (getServerSession as any).mockResolvedValueOnce({ user: mockUser });
      (db.page.create as any).mockResolvedValueOnce(mockPage);

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test Page' }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.page).toEqual(mockPage);
      expect(db.page.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Page',
          content: '',
          userId: 'user-1',
        },
        include: { children: true, parent: true },
      });
    });

    it('validates required fields', async () => {
      const mockUser = { id: 'user-1', username: 'testuser' };
      (getServerSession as any).mockResolvedValueOnce({ user: mockUser });

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'POST',
        body: JSON.stringify({}), // Missing title
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });
  });

  describe('PUT', () => {
    it('returns 401 when user is not authenticated', async () => {
      (getServerSession as any).mockResolvedValueOnce(null);

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'PUT',
        body: JSON.stringify({ id: 'page-1', title: 'Updated Page' }),
      });
      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('updates page for authenticated user', async () => {
      const mockUser = { id: 'user-1', username: 'testuser' };
      const mockPage = { id: 'page-1', title: 'Updated Page', userId: 'user-1' };

      (getServerSession as any).mockResolvedValueOnce({ user: mockUser });
      (db.page.findFirst as any).mockResolvedValueOnce({ id: 'page-1', userId: 'user-1' });
      (db.page.update as any).mockResolvedValueOnce(mockPage);

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'PUT',
        body: JSON.stringify({ id: 'page-1', title: 'Updated Page' }),
      });
      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.page).toEqual(mockPage);
    });

    it('returns 404 when page is not found', async () => {
      const mockUser = { id: 'user-1', username: 'testuser' };
      (getServerSession as any).mockResolvedValueOnce({ user: mockUser });
      (db.page.findFirst as any).mockResolvedValueOnce(null);

      const request = new NextRequest('http://localhost:3000/api/pages', {
        method: 'PUT',
        body: JSON.stringify({ id: 'page-1', title: 'Updated Page' }),
      });
      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Page not found');
    });
  });

  describe('DELETE', () => {
    it('returns 401 when user is not authenticated', async () => {
      (getServerSession as any).mockResolvedValueOnce(null);

      const request = new NextRequest('http://localhost:3000/api/pages?id=page-1');
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('deletes page for authenticated user', async () => {
      const mockUser = { id: 'user-1', username: 'testuser' };
      (getServerSession as any).mockResolvedValueOnce({ user: mockUser });
      (db.page.findFirst as any).mockResolvedValueOnce({ id: 'page-1', userId: 'user-1' });
      (db.page.delete as any).mockResolvedValueOnce({});

      const request = new NextRequest('http://localhost:3000/api/pages?id=page-1');
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Page deleted successfully');
    });

    it('returns 400 when page ID is missing', async () => {
      const mockUser = { id: 'user-1', username: 'testuser' };
      (getServerSession as any).mockResolvedValueOnce({ user: mockUser });

      const request = new NextRequest('http://localhost:3000/api/pages');
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Page ID is required');
    });
  });
});
