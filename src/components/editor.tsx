'use client';
import { useEffect, useState } from 'react';

export default function Editor({ pageId }: { pageId: string | null }) {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
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
          if (page.contentJson?.content) {
            setContent(page.contentJson.content);
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
      
      {/* BlockNote Toolbar Placeholder */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">BlockNote Toolbar</span>
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="flex-1 p-6">
        {pageId ? (
          <textarea
            placeholder="Start writing..."
            value={content}
            className="w-full h-full min-h-[600px] border-none outline-none resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            onChange={async (e) => {
              const newContent = e.target.value;
              setContent(newContent);
              console.log('Saving content:', newContent);
              try {
                const response = await fetch(`/api/pages/${pageId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    contentJson: { content: newContent }
                  }),
                });
                if (response.ok) {
                  console.log('Content saved successfully');
                } else {
                  console.error('Failed to save content:', response.status, response.statusText);
                }
              } catch (error) {
                console.error('Error saving content:', error);
              }
            }}
          />
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
