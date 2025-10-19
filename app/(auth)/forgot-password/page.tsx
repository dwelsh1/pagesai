import { ForgotPassword } from '@/components/auth/forgot-password';

export default function ForgotPasswordPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Forgot Password?
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <div className='bg-white py-8 px-6 shadow rounded-lg'>
          <ForgotPassword />
        </div>
        
        <div className='text-center'>
          <a
            href='/login'
            className='font-medium text-gray-900 hover:text-gray-700'
          >
            ← Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
