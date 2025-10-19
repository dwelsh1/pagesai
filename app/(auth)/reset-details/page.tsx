'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

export default function ResetDetailsPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const username = searchParams.get('username');
  const token = searchParams.get('token');

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Password Reset Details
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Development mode - Password reset information
          </p>
        </div>
        
        <div className='bg-white py-8 px-6 shadow rounded-lg'>
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='text-green-500 text-6xl mb-4'>✓</div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Reset Link Generated
              </h3>
              <p className='text-gray-600 mb-6'>
                For development purposes, here are the reset details:
              </p>
            </div>

            <div className='space-y-4'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>User Details:</h4>
                <div className='space-y-2 text-sm'>
                  <div>
                    <span className='font-medium'>Email:</span> {email || 'N/A'}
                  </div>
                  <div>
                    <span className='font-medium'>Username:</span> {username || 'N/A'}
                  </div>
                </div>
              </div>

              <div className='bg-blue-50 p-4 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>Reset Token:</h4>
                <div className='text-sm font-mono break-all text-blue-800'>
                  {token || 'N/A'}
                </div>
              </div>

              <div className='bg-yellow-50 p-4 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>Reset Link:</h4>
                <div className='text-sm font-mono break-all text-yellow-800'>
                  {token ? `http://localhost:3000/reset-password?token=${token}` : 'N/A'}
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              <Button
                onClick={() => {
                  if (token) {
                    window.location.href = `/reset-password?token=${token}`;
                  }
                }}
                className='w-full bg-gray-900 text-white hover:bg-gray-800'
                disabled={!token}
              >
                Go to Reset Password Page
              </Button>
              
              <Link href='/login'>
                <Button
                  variant='outline'
                  className='w-full'
                >
                  ← Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
