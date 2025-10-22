'use client';

import { MainLayout } from '@/components/layout';
import { PageViewer } from '@/components/editor/page-viewer';

interface ViewPagePageProps {
  params: { id: string };
}

export default function ViewPagePage({ params }: ViewPagePageProps) {
  const { id } = params;
  
  return (
    <MainLayout>
      <PageViewer pageId={id} />
    </MainLayout>
  );
}
