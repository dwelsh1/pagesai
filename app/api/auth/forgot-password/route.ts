import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordReset } from '@/server/auth';
import { forgotPasswordSchema } from '@/lib/validators/auth';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    console.log('Forgot Password API called');
    const body = await request.json();
    console.log('Request body:', body);

    // Validate input
    const validatedData = forgotPasswordSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Request password reset
    const result = await requestPasswordReset(validatedData.email);
    console.log('Password reset requested:', result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Forgot password error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === 'Email not found') {
        return NextResponse.json(
          { error: 'Email not found' },
          { status: 404 }
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
