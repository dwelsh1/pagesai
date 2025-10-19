import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordWithToken } from '@/server/auth';
import { resetPasswordSchema } from '@/lib/validators/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Reset Password API called');
    const body = await request.json();
    console.log('Request body:', body);

    // Validate input
    const validatedData = resetPasswordSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Reset password with token
    const result = await resetPasswordWithToken(
      validatedData.token,
      validatedData.password
    );
    console.log('Password reset:', result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Reset password error:', error);

    if (error instanceof Error) {
      if (error.message === 'Invalid or expired token') {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 400 }
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
