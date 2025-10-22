'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect } from 'react';
import { blockNoteToHtml } from '@/lib/blocknote-to-html';
import { FloatingToolbar } from './floating-toolbar';
import '@/styles/tiptap-editor.css';

interface TipTapEditorProps {
  content?: string;
  onUpdate?: (content: string) => void;
  editable?: boolean;
  className?: string;
}

export function TipTapEditor({ 
  content = '', 
  onUpdate, 
  editable = true,
  className = ''
}: TipTapEditorProps) {
  
  // Convert BlockNote JSON to HTML if needed
  const htmlContent = content.startsWith('[') || content.startsWith('{') 
    ? blockNoteToHtml(content) 
    : content;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable default styling that creates boxes
        paragraph: {
          HTMLAttributes: {
            class: '',
          },
        },
        heading: {
          HTMLAttributes: {
            class: '',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: '',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: '',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: '',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: '',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: '',
          },
        },
        code: {
          HTMLAttributes: {
            class: '',
          },
        },
      }),
    ],
    content: htmlContent,
    editable,
    immediatelyRender: true,
    editorProps: {
      attributes: {
        class: 'prose-none focus:outline-none border-none',
        style: 'background: transparent; border: none; outline: none;',
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        const html = editor.getHTML();
        onUpdate(html);
      }
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && htmlContent !== editor.getHTML()) {
      editor.commands.setContent(htmlContent);
    }
  }, [htmlContent, editor]);

  // Update editable state when prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);


  // Show loading state only if editor is truly not ready
  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`tiptap-editor h-full w-full ${className}`} style={{ background: 'transparent' }}>
      <EditorContent 
        editor={editor} 
        className="h-full w-full focus:outline-none p-0 m-0 border-0"
        style={{ background: 'transparent', border: 'none', outline: 'none' }}
      />
      <FloatingToolbar editor={editor} />
    </div>
  );
}