import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg shadow-sm p-8'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>PagesAI</h1>
            <p className='text-gray-600'>Create your account</p>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  );
}
