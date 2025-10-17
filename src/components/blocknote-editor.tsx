'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import BlockNote components to avoid SSR issues
const BlockNoteView = dynamic(
  () => import('@blocknote/react').then((mod) => ({ default: mod.BlockNoteView })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-gray-500">Loading editor...</div>
      </div>
    )
  }
);

const FormattingToolbar = dynamic(
  () => import('@blocknote/react').then((mod) => ({ default: mod.FormattingToolbar })),
  { ssr: false }
);

interface BlockNoteEditorProps {
  pageId: string;
  initialContent?: any;
  onContentChange?: (content: any) => void;
}

export default function BlockNoteEditor({ pageId, initialContent, onContentChange }: BlockNoteEditorProps) {
  const [editor, setEditor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initEditor = async () => {
      try {
        const { BlockNote } = await import('@blocknote/react');
        
        const newEditor = BlockNote.create({
          initialContent: initialContent || [
            {
              type: "paragraph",
              content: "Start writing...",
            },
          ],
        });

        setEditor(newEditor);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing BlockNote editor:', error);
        setIsLoading(false);
      }
    };

    initEditor();
  }, [initialContent]);

  const handleContentChange = async (content: any) => {
    if (onContentChange) {
      onContentChange(content);
    }

    // Auto-save content
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contentJson: content
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to save content:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  if (isLoading || !editor) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <BlockNoteView 
        editor={editor} 
        onChange={handleContentChange}
        className="h-full"
      />
    </div>
  );
}
