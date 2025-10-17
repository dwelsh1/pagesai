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
      <div className="p-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="space-y-4">
        {/* Title Input */}
        {pageId && (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-3xl font-bold border-none outline-none bg-transparent placeholder-gray-400"
          />
        )}
        
        {/* Simple Text Editor */}
        <div className="border rounded-lg overflow-hidden">
          {pageId ? (
            <div className="p-4">
              <textarea
                placeholder="Start writing..."
                value={content}
                className="w-full h-96 border-none outline-none resize-none"
                onChange={async (e) => {
                  const newContent = e.target.value;
                  setContent(newContent); // Update local state immediately
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
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">Create your first page to start writing...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
