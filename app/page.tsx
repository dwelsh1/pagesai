import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          Welcome to PagesAI
        </h1>
        <p className='text-gray-600 mb-8'>
          Your modern web application is ready!
        </p>
        <div className='space-x-4'>
          <Link
            href='/login'
            className='inline-block bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors'
          >
            Go to Login
          </Link>
          <Link
            href='/diagnostics'
            className='inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors'
          >
            System Diagnostics
          </Link>
        </div>
      </div>
    </div>
  );
}
