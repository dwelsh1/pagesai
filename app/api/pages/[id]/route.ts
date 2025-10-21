import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/server/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const pageParamsSchema = z.object({
  id: z.string().min(1, 'Page ID is required'),
});

// GET /api/pages/[id] - Get a specific page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const validatedParams = pageParamsSchema.parse({ id });

    const page = await db.page.findFirst({
      where: {
        id: validatedParams.id,
        userId: session.user.id,
      },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ page });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

// PUT /api/pages/[id] - Update a specific page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const validatedParams = pageParamsSchema.parse({ id });

    const body = await request.json();
    const updateData = z.object({
      title: z.string().min(1).max(200).optional(),
      content: z.string().optional(),
      description: z.string().optional(),
      tags: z.string().optional(),
      parentId: z.string().optional(),
      isPublished: z.boolean().optional(),
    }).parse(body);

    // Check if page exists and belongs to user
    const existingPage = await db.page.findFirst({
      where: {
        id: validatedParams.id,
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
        id: validatedParams.id,
      },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        children: true,
        parent: true,
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

// DELETE /api/pages/[id] - Delete a specific page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const validatedParams = pageParamsSchema.parse({ id });

    // Check if page exists and belongs to user
    const existingPage = await db.page.findFirst({
      where: {
        id: validatedParams.id,
        userId: session.user.id,
      },
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Delete the page
    await db.page.delete({
      where: {
        id: validatedParams.id,
      },
    });

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
