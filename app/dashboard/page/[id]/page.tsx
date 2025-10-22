'use client';

import { MainLayout } from '@/components/layout';
import { PageViewer } from '@/components/editor/page-viewer';
import { use } from 'react';

interface ViewPagePageProps {
  params: Promise<{ id: string }>;
}

export default function ViewPagePage({ params }: ViewPagePageProps) {
  const { id } = use(params);
  
  return (
    <MainLayout>
      <PageViewer pageId={id} />
    </MainLayout>
  );
}
