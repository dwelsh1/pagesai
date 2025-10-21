'use client';

import { MainLayout } from '@/components/layout';
import { PageEditor } from '@/components/editor/page-editor';
import { useRouter } from 'next/navigation';

export default function CreatePagePage() {
  const router = useRouter();

  const handleSave = async (data: { title: string; content: string; description?: string }) => {
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create page');
      }

      const { page } = await response.json();
      router.push(`/dashboard/page/${page.id}`);
    } catch (error) {
      console.error('Failed to create page:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <MainLayout>
      <PageEditor
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={false}
      />
    </MainLayout>
  );
}
