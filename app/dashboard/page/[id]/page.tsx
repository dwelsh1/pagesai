'use client';

import { MainLayout } from '@/components/layout';
import { PageViewer } from '@/components/editor/page-viewer';

interface ViewPagePageProps {
  params: Promise<{ id: string }>;
}

export default function ViewPagePage({ params }: ViewPagePageProps) {
  return (
    <MainLayout>
      <PageViewer pageId={(params as any).id} />
    </MainLayout>
  );
}
