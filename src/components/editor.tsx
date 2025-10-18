'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import BlockNote editor to prevent SSR issues
const BlockNoteEditor = dynamic(() => import('./blocknote-editor'), {
  ssr: false,
  loading: () => (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  ),
});

export default function Editor({ pageId }: { pageId: string | null }) {
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Load page data when pageId changes
  useEffect(() => {
    if (!pageId) {
      setIsLoading(false);
      return;
    }

    const loadPage = async () => {
      try {
        const response = await fetch(`/api/pages/${pageId}`);
        if (response.ok) {
          const page = await response.json();
          setTitle(page.title || '');
        }
      } catch (error) {
        console.error('Error loading page:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [pageId]);

  // Handle title changes
  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!pageId) return;
    const newTitle = e.target.value;
    setTitle(newTitle);

    try {
      await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
    } catch (error) {
      console.error('Error saving title:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Title Input */}
      {pageId && (
        <div className="p-6 pb-0">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-3xl font-bold border-none outline-none bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
          />
        </div>
      )}
      
      {/* BlockNote Editor - Full Width */}
      <div className="flex-1">
        {pageId ? (
          <BlockNoteEditor 
            pageId={pageId}
            onContentChange={(content) => {
              console.log('Content changed:', content);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full min-h-[600px] text-center text-gray-500 dark:text-gray-400 p-6">
            <div>
              <p className="text-lg mb-2">Create your first page to start writing...</p>
              <p className="text-sm">Click the + button in the header to create a new page</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
