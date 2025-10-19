'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function APIDocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch('/api/openapi.json');
        if (!response.ok) {
          throw new Error('Failed to fetch API specification');
        }
        const specData = await response.json();
        setSpec(specData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Error Loading Documentation
          </h1>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='bg-gray-900 text-white py-4 px-6'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold'>PagesAI API Documentation</h1>
          <p className='text-gray-300 mt-2'>
            Interactive API documentation for PagesAI authentication endpoints
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto p-6'>
        <SwaggerUI
          spec={spec}
          docExpansion='list'
          defaultModelsExpandDepth={2}
          defaultModelExpandDepth={2}
          tryItOutEnabled={true}
          requestInterceptor={(request: any) => {
            // Add any custom request headers or modifications here
            return request;
          }}
          responseInterceptor={(response: any) => {
            // Add any custom response handling here
            return response;
          }}
        />
      </div>
    </div>
  );
}
