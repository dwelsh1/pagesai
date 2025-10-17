'use client';
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';

// Dynamically import BlockNote components to avoid SSR issues
const BlockNoteViewEditor = dynamic(
  () => import('@blocknote/react').then((mod) => mod.BlockNoteViewEditor),
  { ssr: false }
);

const FormattingToolbar = dynamic(
  () => import('@blocknote/react').then((mod) => mod.FormattingToolbar),
  { ssr: false }
);

const useCreateBlockNote = dynamic(
  () => import('@blocknote/react').then((mod) => mod.useCreateBlockNote),
  { ssr: false }
);

export default function Editor({ pageId }: { pageId: string | null }) {
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [editor, setEditor] = useState<any>(null);

  // Create the BlockNote editor instance only on client side
  useEffect(() => {
    const createEditor = async () => {
      const { useCreateBlockNote: createBlockNote } = await import('@blocknote/react');
      const editorInstance = createBlockNote({
        initialContent: [
          {
            type: "paragraph",
            content: "Start writing...",
          },
        ],
      });
      setEditor(editorInstance);
    };
    createEditor();
  }, []);

  // Load page data when pageId changes
  useEffect(() => {
    if (!pageId || !editor) {
      setIsLoading(false);
      return;
    }

    const loadPage = async () => {
      try {
        const response = await fetch(`/api/pages/${pageId}`);
        if (response.ok) {
          const page = await response.json();
          setTitle(page.title || '');
          
          // Convert content to BlockNote format
          if (page.contentJson?.content) {
            try {
              const blocks = typeof page.contentJson.content === 'string' 
                ? JSON.parse(page.contentJson.content)
                : page.contentJson.content;
              editor.replaceBlocks(editor.document, blocks);
            } catch (error) {
              console.error('Error parsing content:', error);
              // Fallback to simple text
              editor.replaceBlocks(editor.document, [
                {
                  type: "paragraph",
                  content: page.contentJson.content,
                },
              ]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading page:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [pageId, editor]);

  // Handle content changes with debouncing
  const handleContentChange = useCallback(async () => {
    if (!pageId || !editor) return;

    try {
      const blocks = editor.document;
      await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contentJson: { content: JSON.stringify(blocks) }
        }),
      });
    } catch (error) {
      console.error('Error saving content:', error);
    }
  }, [pageId, editor]);

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

  // Debounced content saving
  useEffect(() => {
    if (!pageId || isLoading || !editor) return;

    const timeoutId = setTimeout(() => {
      handleContentChange();
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [editor?.document, pageId, isLoading, handleContentChange]);

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
        
        {/* BlockNote Editor */}
        <div className="border rounded-lg overflow-hidden">
          {pageId && editor ? (
            <BlockNoteViewEditor 
              editor={editor}
              className="min-h-[400px]"
            >
              <FormattingToolbar />
            </BlockNoteViewEditor>
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
