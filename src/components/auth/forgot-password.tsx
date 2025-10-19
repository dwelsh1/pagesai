'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validators/auth';
import { ZodError } from 'zod';
import { useRouter } from 'next/navigation';

interface ForgotPasswordProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export function ForgotPassword({ onClose, onSuccess }: ForgotPasswordProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ForgotPasswordInput>({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ForgotPasswordInput>>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ForgotPasswordInput]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Password reset request failed');
      }

      const responseData = await response.json();
      
      // If not in a modal (standalone page), redirect to details page
      if (!onClose && !onSuccess) {
        const params = new URLSearchParams({
          email: responseData.user?.email || '',
          username: responseData.user?.username || '',
          token: responseData.token || ''
        });
        router.push(`/reset-details?${params.toString()}`);
      } else {
        // Show success message for modal usage
        setShowSuccessMessage(true);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle Zod validation errors
        const fieldErrors: Partial<ForgotPasswordInput> = {};
        if (error.issues && Array.isArray(error.issues)) {
          error.issues.forEach((err: any) => {
            if (err.path && err.path[0] === 'email') {
              fieldErrors.email = err.message;
            }
          });
        }
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        if (error.message.includes('Email not found')) {
          setErrors({ email: 'Email not found' });
        } else if (error.message.includes('Validation failed')) {
          setErrors({ email: 'Invalid email address' });
        } else {
          setErrors({ email: error.message });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccessMessage) {
    return (
      <div className='text-center space-y-4'>
        <div className='text-green-500 text-6xl mb-4'>✓</div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          Check Your Email
        </h2>
        <p className='text-gray-600 mb-6'>
          We&apos;ve sent a password reset link to <strong>{formData.email}</strong>
        </p>
        <div className='space-y-3'>
          <Button
            onClick={() => {
              if (onClose) {
                setShowSuccessMessage(false);
                onClose();
              } else {
                router.push('/login');
              }
            }}
            className='w-full bg-gray-900 text-white hover:bg-gray-800'
          >
            {onClose ? 'Close' : 'Back to Sign In'}
          </Button>
          <Button
            onClick={() => {
              setShowSuccessMessage(false);
              setFormData({ email: '' });
            }}
            variant='outline'
            className='w-full'
          >
            Send Another Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email Address</Label>
          <Input
            id='email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleInputChange}
            placeholder='Enter your email address'
            data-testid='email-input'
            className={errors.email ? 'border-red-500' : ''}
            required
          />
          {errors.email && (
            <p className='text-sm text-red-600' data-testid='email-error'>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className='space-y-3'>
        <Button
          type='submit'
          className='w-full bg-gray-900 text-white hover:bg-gray-800'
          disabled={isLoading}
          data-testid='send-reset-button'
        >
          {isLoading ? 'Loading...' : 'Show User\'s Login Credentials'}
        </Button>
        
        {onClose && (
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='w-full'
            data-testid='cancel-button'
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
