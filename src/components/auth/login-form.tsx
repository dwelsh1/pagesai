'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';
import { ZodError } from 'zod';

export function LoginSuccessModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className='fixed inset-0 bg-black' onClick={onClose}></div>
      <div className='relative bg-white rounded-lg p-6 max-w-md w-full mx-4'>
        <h2 className='text-xl font-semibold mb-2'>Login Successful!</h2>
        <p className='text-gray-600 mb-4'>
          Welcome to PagesAI. You have successfully logged in.
        </p>
        <div className='flex justify-end'>
          <Button onClick={onClose}>Continue</Button>
        </div>
      </div>
    </div>
  );
}

export function LoginForm() {
  const [formData, setFormData] = useState<LoginInput>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginInput>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData);

      // Submit to API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle Zod validation errors
        const fieldErrors: Partial<LoginInput> = {};
        if (error.issues && Array.isArray(error.issues)) {
          error.issues.forEach((err: any) => {
            if (err.path && err.path[0] === 'username') {
              fieldErrors.username = err.message;
            } else if (err.path && err.path[0] === 'password') {
              fieldErrors.password = err.message;
            }
          });
        }
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        if (error.message.includes('Invalid credentials')) {
          setErrors({
            username: 'Invalid credentials',
            password: 'Invalid credentials',
          });
        } else {
          setErrors({ username: error.message });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof LoginInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    };

  return (
    <>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='username'>Username</Label>
          <Input
            id='username'
            type='text'
            placeholder='Enter your username'
            value={formData.username}
            onChange={handleInputChange('username')}
            data-testid='username-input'
            className={errors.username ? 'border-red-500' : ''}
          />
          {errors.username && (
            <p className='text-sm text-red-500' data-testid='username-error'>
              {errors.username}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            placeholder='Enter your password'
            value={formData.password}
            onChange={handleInputChange('password')}
            data-testid='password-input'
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className='text-sm text-red-500' data-testid='password-error'>
              {errors.password}
            </p>
          )}
        </div>

        <Button
          type='submit'
          className='w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition-colors'
          disabled={isLoading}
          data-testid='sign-in-button'
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className='text-center text-sm text-gray-600 mb-4'>
        <Link
          href='/forgot-password'
          className='text-gray-900 hover:underline'
          data-testid='forgot-password-link'
        >
          Forgot your password?
        </Link>
      </div>

      <div className='text-center text-sm text-gray-600'>
        Don&apos;t have an account?{' '}
        <Link
          href='/signup'
          className='text-gray-900 hover:underline'
          data-testid='sign-up-link'
        >
          Sign up
        </Link>
      </div>

      <LoginSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
