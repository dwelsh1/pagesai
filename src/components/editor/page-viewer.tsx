'use client';

import { BlockNoteView } from '@blocknote/react';
import { BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, ArrowLeft, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
  },
});

interface PageViewerProps {
  pageId: string;
}

interface PageData {
  id: string;
  title: string;
  content: string;
  description?: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
  };
}

export function PageViewer({ pageId }: PageViewerProps) {
  const router = useRouter();
  const [page, setPage] = useState<PageData | null>(null);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/pages/${pageId}`);
        
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

        // Initialize editor for viewing
        const newEditor = BlockNoteEditor.create({
          schema,
          initialContent: pageData.content ? JSON.parse(pageData.content) : undefined,
          editable: false, // Read-only mode
        });

        setEditor(newEditor);
      } catch (error) {
        console.error('Error fetching page:', error);
        setError('Failed to load page');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [pageId]);

  const handleEdit = () => {
    router.push(`/dashboard/page/${pageId}/edit`);
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Page not found'}</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const tags = page.tags ? page.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          title="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleEdit}
          size="sm"
          title="Edit this page"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Page Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900">
            {page.title}
          </CardTitle>
          {page.description && (
            <p className="text-lg text-gray-600 mt-2">
              {page.description}
            </p>
          )}
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{page.user.username}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Created {new Date(page.createdAt).toLocaleDateString()}</span>
            </div>
            {page.updatedAt !== page.createdAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          {editor && (
            <div className="prose max-w-none">
              <BlockNoteView
                editor={editor}
                theme="light"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
