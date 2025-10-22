'use client';

import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
  },
});

// Dynamic import for BlockNote editor to avoid SSR issues
const BlockNoteEditor = dynamic(
  () => import('@blocknote/react').then((mod) => ({ 
    default: ({ editor, onContentChange }: { editor: any; onContentChange: () => void }) => {
      const { BlockNoteViewEditor } = mod;
      
      return (
        <BlockNoteViewEditor 
          editor={editor} 
          editable={true}
          className="prose max-w-none min-h-[500px] focus:outline-none"
          onContentChange={onContentChange}
        />
      );
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

// Client-side only editor component with auto-save
function ClientBlockNoteEditor({ content, pageId }: { content: string; pageId: string }) {
  const [editor, setEditor] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const initEditor = async () => {
      const { BlockNoteEditor } = await import('@blocknote/core');
      
      const newEditor = BlockNoteEditor.create({
        schema,
        initialContent: content ? JSON.parse(content) : undefined,
      });
      
      // Set editor as editable (new way)
      newEditor.isEditable = true;
      
      setEditor(newEditor);
    };

    initEditor();
  }, [content]);

  // Auto-save functionality with debouncing
  const autoSave = useCallback(async () => {
    if (!editor || !hasUnsavedChanges) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const currentContent = JSON.stringify(editor.document);
      
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: currentContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save page');
      }

      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      
      // Clear save status after 2 seconds
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
      
      // Clear error status after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [editor, hasUnsavedChanges, pageId]);

  // Debounced auto-save
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timeoutId = setTimeout(() => {
      autoSave();
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [hasUnsavedChanges, autoSave]);

  const handleContentChange = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  if (!editor) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded"></div>;
  }

  return (
    <div className="relative">
      {/* Save status indicator */}
      {saveStatus && (
        <div className="absolute top-4 right-4 z-10">
          {saveStatus === 'saving' && (
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-800"></div>
              <span>Saving...</span>
            </div>
          )}
          {saveStatus === 'saved' && (
            <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              <Save className="h-3 w-3" />
              <span>Saved</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
              <AlertCircle className="h-3 w-3" />
              <span>Save failed</span>
            </div>
          )}
        </div>
      )}
      
      <BlockNoteEditor 
        editor={editor} 
        onContentChange={handleContentChange}
      />
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

  return (
    <div className="h-full flex flex-col">
      {/* Minimal header with just back button */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          title="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold text-gray-900 truncate">
          {page.title}
        </h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Full-height content area */}
      <div className="flex-1 p-6 overflow-auto">
        {isClient && page ? (
          <ClientBlockNoteEditor content={page.content} pageId={pageId} />
        ) : (
          <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
        )}
      </div>
    </div>
  );
}
