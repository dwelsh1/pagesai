'use client';

import { MainLayout } from '@/components/layout';
import { SimplePageCreator } from '@/components/editor/simple-page-creator';
import { useRouter } from 'next/navigation';

export default function CreatePagePage() {
  const router = useRouter();

  const handleSave = async (data: { title: string }) => {
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          content: '', // Empty content initially
          description: '', // Empty description initially
        }),
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
      <SimplePageCreator
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </MainLayout>
  );
}
