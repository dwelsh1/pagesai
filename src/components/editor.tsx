'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import BlockNote components to avoid SSR issues
const BlockNoteEditor = dynamic(
  () => import('./blocknote-editor'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-gray-500">Loading editor...</div>
      </div>
    )
  }
);

const BlockNoteToolbar = dynamic(
  () => import('./blocknote-toolbar'),
  { ssr: false }
);

export default function Editor({ pageId }: { pageId: string | null }) {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<any>(null);
  const [editor, setEditor] = useState<any>(null);
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
          // Load existing content
          if (page.contentJson) {
            setContent(page.contentJson);
          } else {
            setContent([
              {
                type: "paragraph",
                content: "Start writing...",
              },
            ]);
          }
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

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
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
      
      {/* BlockNote Editor */}
      <div className="flex-1 flex flex-col">
        {pageId ? (
          <>
            {/* Toolbar */}
            <BlockNoteToolbar editor={editor} />
            
            {/* Editor */}
            <div className="flex-1 p-6">
              <BlockNoteEditor 
                pageId={pageId}
                initialContent={content}
                onContentChange={handleContentChange}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[600px] text-center text-gray-500 dark:text-gray-400">
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
