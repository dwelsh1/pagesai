import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/server/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

// Validation schemas
const createPageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().optional().default(''),
  description: z.string().optional(),
  tags: z.string().optional(),
  parentId: z.string().optional(),
});

const updatePageSchema = createPageSchema.partial().extend({
  id: z.string().min(1, 'Page ID is required'),
});

const pageParamsSchema = z.object({
  id: z.string().min(1, 'Page ID is required'),
});

// GET /api/pages - List all pages for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pages = await db.page.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        children: true,
        parent: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST /api/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPageSchema.parse(body);

    const page = await db.page.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        children: true,
        parent: true,
        user: true,
      },
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}

// PUT /api/pages - Update an existing page
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updatePageSchema.parse(body);

    // Check if page exists and belongs to user
    const existingPage = await db.page.findFirst({
      where: {
        id: validatedData.id,
        userId: session.user.id,
      },
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    const page = await db.page.update({
      where: {
        id: validatedData.id,
      },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        description: validatedData.description,
        tags: validatedData.tags,
        parentId: validatedData.parentId,
        updatedAt: new Date(),
      },
      include: {
        children: true,
        parent: true,
        user: true,
      },
    });

    return NextResponse.json({ page });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE /api/pages - Delete a page
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('id');

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    // Check if page exists and belongs to user
    const existingPage = await db.page.findFirst({
      where: {
        id: pageId,
        userId: session.user.id,
      },
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Delete the page (children will be handled by cascade or we can move them to parent)
    await db.page.delete({
      where: {
        id: pageId,
      },
    });

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
