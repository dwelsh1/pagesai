import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/server/auth';
import { registerSchema } from '@/lib/validators/auth';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    console.log('Register API called');
    const body = await request.json();
    console.log('Request body:', body);

    // Validate input
    const validatedData = registerSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Create user
    const user = await createUser(
      validatedData.username,
      validatedData.password,
      validatedData.email
    );
    console.log('User created:', user);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === 'Username already exists') {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }

      if (error.message === 'Email already exists') {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }

      // Check if it's a database/server error
      if (error.message.includes('Database') || error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
