'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { TipTapEditor } from '@/components/editor/tiptap-editor';

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
function ClientTipTapEditor({ content, pageId }: { content: string; pageId: string }) {
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save functionality with debouncing
  const autoSave = useCallback(async (newContent: string) => {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newContent,
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
  }, [hasUnsavedChanges, pageId]);


  const handleContentUpdate = useCallback((newContent: string) => {
    setHasUnsavedChanges(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounced auto-save
    timeoutRef.current = setTimeout(() => {
      autoSave(newContent);
    }, 2000);
  }, [autoSave]);

  return (
    <div className="relative h-full w-full">
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
      
      <TipTapEditor
        content={content}
        onUpdate={handleContentUpdate}
        editable={true}
        className="h-full w-full focus:outline-none"
      />
    </div>
  );
}

export function PageViewer({ pageId }: PageViewerProps) {
  
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
        const response = await fetch(`/api/pages/${pageId}`, {
          credentials: 'include',
        });
        
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
          <p className="text-gray-600">{error || 'Page not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white">
      {/* Full-height content area with white background - no internal header */}
      <div className="h-full w-full">
        {isClient && page ? (
          <ClientTipTapEditor content={page.content} pageId={pageId} />
        ) : (
          <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
        )}
      </div>
    </div>
  );
}