'use client';
import { useEffect, useState, useCallback } from 'react';
import { BlockNoteViewEditor, FormattingToolbar, useCreateBlockNote } from '@blocknote/react';

export default function BlockNoteEditor({ pageId }: { pageId: string }) {
  const [isLoading, setIsLoading] = useState(true);

  // Create the BlockNote editor instance
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Start writing...",
      },
    ],
  });

  // Load page content when pageId changes
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
    if (!pageId) return;

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

  // Debounced content saving
  useEffect(() => {
    if (!pageId || isLoading) return;

    const timeoutId = setTimeout(() => {
      handleContentChange();
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [editor.document, pageId, isLoading, handleContentChange]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <BlockNoteViewEditor 
      editor={editor}
      className="min-h-[400px]"
    >
      <FormattingToolbar />
    </BlockNoteViewEditor>
  );
}
