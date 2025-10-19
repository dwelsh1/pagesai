import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/server/auth';
import { createSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validators/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called');
    const body = await request.json();
    console.log('Request body:', body);

    // Validate input
    const validatedData = loginSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Authenticate user
    const user = await authenticateUser(
      validatedData.username,
      validatedData.password
    );
    console.log('User authenticated:', user);

    // Create session
    await createSession(user.id, user.username);
    console.log('Session created');

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof Error) {
      if (error.message === 'Invalid credentials') {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
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
