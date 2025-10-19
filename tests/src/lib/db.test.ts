import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db';

// Mock Prisma Client
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $disconnect: vi.fn(),
  })),
}));

describe('Database Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a Prisma client instance', () => {
    expect(db).toBeDefined();
    expect(db.user).toBeDefined();
  });

  it('should have user model methods', () => {
    expect(typeof db.user.findUnique).toBe('function');
    expect(typeof db.user.findMany).toBe('function');
    expect(typeof db.user.create).toBe('function');
    expect(typeof db.user.update).toBe('function');
    expect(typeof db.user.delete).toBe('function');
  });

  it('should have disconnect method', () => {
    expect(typeof db.$disconnect).toBe('function');
  });
});
