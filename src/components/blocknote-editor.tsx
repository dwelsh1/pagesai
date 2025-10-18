'use client';

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "../../styles/blocknote-theme.css";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface BlockNoteEditorProps {
  pageId: string;
  initialContent?: any;
  onContentChange?: (content: any) => void;
}

export default function BlockNoteEditor({ pageId, initialContent, onContentChange }: BlockNoteEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(initialContent);
  const { theme } = useTheme();

  // Create editor instance with enhanced configuration
  const editor = useCreateBlockNote({
    initialContent: content || [
      {
        type: "paragraph",
        content: "Start writing...",
      },
    ],
  });

  // Load existing content when pageId changes
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
          if (page.contentJson?.blocks) {
            setContent(page.contentJson.blocks);
            editor.replaceBlocks(editor.document, page.contentJson.blocks);
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
  const handleContentChange = async (newContent: any) => {
    setContent(newContent);
    
    if (onContentChange) {
      onContentChange(newContent);
    }

    // Auto-save content - only save the document content, not the entire editor object
    if (pageId) {
      try {
        // Get the document content from the editor
        const documentContent = editor.document;
        
        await fetch(`/api/pages/${pageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            contentJson: { blocks: documentContent }
          }),
        });
      } catch (error) {
        console.error('Error saving content:', error);
      }
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
    <div className="h-full">
      <BlockNoteView
        editor={editor}
        onChange={handleContentChange}
        theme={theme === 'dark' ? 'dark' : 'light'}
        className="min-h-[600px]"
        data-theme={theme}
      />
    </div>
  );
}