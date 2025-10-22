'use client';

import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { BlockNoteContext } from '@blocknote/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, ArrowLeft, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
  },
});

// Simple HTML renderer for BlockNote content (read-only)
const BlockNoteRenderer = ({ content }: { content: any[] }) => {
  const renderBlock = (block: any, index: number) => {
    const key = `block-${index}`;
    
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={key} className="mb-2">
            {block.content?.map((item: any, i: number) => 
              item.type === 'text' ? (
                <span key={i}>{item.text}</span>
              ) : null
            )}
          </p>
        );
      
      case 'heading':
        const HeadingTag = `h${block.props?.level || 1}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag key={key} className="mb-3 font-bold">
            {block.content?.map((item: any, i: number) => 
              item.type === 'text' ? (
                <span key={i}>{item.text}</span>
              ) : null
            )}
          </HeadingTag>
        );
      
      case 'bulletListItem':
        return (
          <li key={key} className="mb-1">
            {block.content?.map((item: any, i: number) => 
              item.type === 'text' ? (
                <span key={i}>{item.text}</span>
              ) : null
            )}
          </li>
        );
      
      default:
        return (
          <div key={key} className="mb-2">
            {block.content?.map((item: any, i: number) => 
              item.type === 'text' ? (
                <span key={i}>{item.text}</span>
              ) : null
            )}
          </div>
        );
    }
  };

  return (
    <div className="prose max-w-none">
      {content?.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

// Dynamic import for BlockNote editor to avoid SSR issues
const BlockNoteEditor = dynamic(
  () => import('@blocknote/react').then((mod) => ({ 
    default: ({ editor }: { editor: any }) => {
      console.log('Dynamic BlockNoteEditor component - editor:', editor);
      console.log('Available exports from @blocknote/react:', Object.keys(mod));
      
      // Get the current content from the editor
      const content = editor.document;
      console.log('Editor content:', content);
      
      return <BlockNoteRenderer content={content} />;
    }
  })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
  }
);

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

// Client-side only editor component
function ClientBlockNoteEditor({ content }: { content: string }) {
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    const initEditor = async () => {
      console.log('Initializing BlockNote editor with content:', content);
      const { BlockNoteEditor } = await import('@blocknote/core');
      console.log('BlockNoteEditor from core:', BlockNoteEditor);
      
      const newEditor = BlockNoteEditor.create({
        schema,
        initialContent: content ? JSON.parse(content) : undefined,
        editable: false,
      });
      
      console.log('Created editor:', newEditor);
      setEditor(newEditor);
    };

    initEditor();
  }, [content]);

  console.log('ClientBlockNoteEditor render - editor:', editor);

  if (!editor) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded"></div>;
  }

  return (
    <div className="prose max-w-none">
      <BlockNoteContext.Provider value={editor}>
        <BlockNoteEditor editor={editor} />
      </BlockNoteContext.Provider>
    </div>
  );
}

export function PageViewer({ pageId }: PageViewerProps) {
  const router = useRouter();
  const [page, setPage] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

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
          {isClient && page ? (
            <ClientBlockNoteEditor content={page.content} />
          ) : (
            <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
