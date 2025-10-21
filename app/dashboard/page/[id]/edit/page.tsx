'use client';

import { MainLayout } from '@/components/layout';
import { PageEditor } from '@/components/editor/page-editor';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PageData {
  id: string;
  title: string;
  content: string;
  description?: string;
}

interface EditPagePageProps {
  params: Promise<{ id: string }>;
}

export default function EditPagePage({ params }: EditPagePageProps) {
  const router = useRouter();
  const [page, setPage] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/pages/${resolvedParams.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Page not found');
          } else {
            setError('Failed to load page');
          }
          return;
        }

        const { page: pageData } = await response.json();
        setPage(pageData);
      } catch (error) {
        console.error('Error fetching page:', error);
        setError('Failed to load page');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [params]);

  const handleSave = async (data: { title: string; content: string; description?: string }) => {
    try {
      const resolvedParams = await params;
      const response = await fetch(`/api/pages/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update page');
      }

      const { page: updatedPage } = await response.json();
      setPage(updatedPage);
    } catch (error) {
      console.error('Failed to update page:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading page...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !page) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Page not found'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageEditor
        pageId={page.id}
        initialTitle={page.title}
        initialContent={page.content}
        initialDescription={page.description || ''}
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={true}
      />
    </MainLayout>
  );
}
