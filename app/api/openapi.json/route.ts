import { NextResponse } from 'next/server';
import { openApiSpec } from '@/lib/openapi';

export async function GET() {
  try {
    return NextResponse.json(openApiSpec, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error);
    return NextResponse.json(
      { error: 'Failed to generate API specification' },
      { status: 500 }
    );
  }
}
