'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterInput } from '@/lib/validators/auth';
import { ZodError } from 'zod';
import Link from 'next/link';

export function SignupForm() {
  const [formData, setFormData] = useState<RegisterInput>({
    username: '',
    password: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterInput>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof RegisterInput]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle validation errors from API
        if (errorData.error === 'Validation failed' && errorData.issues) {
          const fieldErrors: Partial<RegisterInput> = {};
          errorData.issues.forEach((err: any) => {
            if (err.path && err.path[0] === 'username') {
              fieldErrors.username = err.message;
            } else if (err.path && err.path[0] === 'password') {
              fieldErrors.password = err.message;
            } else if (err.path && err.path[0] === 'email') {
              fieldErrors.email = err.message;
            }
          });
          setErrors(fieldErrors);
          return;
        }
        
        throw new Error(errorData.error || 'Registration failed');
      }

      setShowSuccessModal(true);
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle Zod validation errors
        const fieldErrors: Partial<RegisterInput> = {};
        if (error.issues && Array.isArray(error.issues)) {
          error.issues.forEach((err: any) => {
            if (err.path && err.path[0] === 'username') {
              fieldErrors.username = err.message;
            } else if (err.path && err.path[0] === 'password') {
              fieldErrors.password = err.message;
            } else if (err.path && err.path[0] === 'email') {
              fieldErrors.email = err.message;
            }
          });
        }
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        if (error.message.includes('Username already exists')) {
          setErrors({ username: 'Username already exists' });
        } else if (error.message.includes('Email already exists')) {
          setErrors({ email: 'Email already exists' });
        } else {
          setErrors({ username: error.message });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='username'>Username</Label>
            <Input
              id='username'
              name='username'
              type='text'
              value={formData.username}
              onChange={handleInputChange}
              placeholder='Enter your username'
              data-testid='username-input'
              className={errors.username ? 'border-red-500' : ''}
              required
            />
            {errors.username && (
              <p className='text-sm text-red-600' data-testid='username-error'>
                {errors.username}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email (Optional)</Label>
            <Input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='Enter your email'
              data-testid='email-input'
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className='text-sm text-red-600' data-testid='email-error'>
                {errors.email}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleInputChange}
              placeholder='Enter your password'
              data-testid='password-input'
              className={errors.password ? 'border-red-500' : ''}
              required
            />
            {errors.password && (
              <p className='text-sm text-red-600' data-testid='password-error'>
                {errors.password}
              </p>
            )}
          </div>
        </div>

        <Button
          type='submit'
          className='w-full bg-gray-900 text-white hover:bg-gray-800'
          disabled={isLoading}
          data-testid='sign-up-button'
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='font-medium text-gray-900 hover:underline'
            data-testid='sign-in-link'
          >
            Sign in
          </Link>
        </p>
      </div>

      {showSuccessModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-8 max-w-md w-full mx-4'>
            <div className='text-center'>
              <div className='text-green-500 text-6xl mb-4'>✓</div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Account Created!
              </h2>
              <p className='text-gray-600 mb-6'>
                Your account has been created successfully. You can now sign in.
              </p>
              <div className='space-y-3'>
                <Button
                  onClick={() => setShowSuccessModal(false)}
                  className='w-full bg-gray-900 text-white hover:bg-gray-800'
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowSuccessModal(false);
                    window.location.href = '/login';
                  }}
                  variant='outline'
                  className='w-full'
                >
                  Go to Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
