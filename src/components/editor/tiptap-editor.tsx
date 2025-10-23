'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useCallback, useEffect, useState, useRef } from 'react';
import { blockNoteToHtml } from '@/lib/blocknote-to-html';
import { SlashCommand } from '@/lib/slash-command-extension';
import { SlashCommandMenu } from './slash-command-menu';
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

  // Slash command state
  const [slashCommandOpen, setSlashCommandOpen] = useState(false);
  const [slashCommandPosition, setSlashCommandPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

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
        // Disable duplicate extensions
        underline: false,
        link: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        HTMLAttributes: {
          class: 'text-align',
        },
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      SlashCommand,
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

  // Handle slash command events
  useEffect(() => {
    const handleSlashCommand = (event: CustomEvent) => {
      if (!editorRef.current) return;
      
      const rect = editorRef.current.getBoundingClientRect();
      const position = {
        top: rect.top + 50, // Position below the editor
        left: rect.left + 20, // Position to the left of the editor
      };
      
      setSlashCommandPosition(position);
      setSlashCommandOpen(true);
    };

    window.addEventListener('slashCommand', handleSlashCommand as EventListener);
    
    return () => {
      window.removeEventListener('slashCommand', handleSlashCommand as EventListener);
    };
  }, []);

  // Close slash command menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (slashCommandOpen && editorRef.current && !editorRef.current.contains(event.target as Node)) {
        setSlashCommandOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [slashCommandOpen]);

  const handleSlashCommandClose = useCallback(() => {
    setSlashCommandOpen(false);
  }, []);


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
    <>
      <div 
        ref={editorRef}
        className={`tiptap-editor h-full w-full ${className}`} 
        style={{ background: 'transparent' }}
      >
        <EditorContent 
          editor={editor} 
          className="h-full w-full focus:outline-none p-0 m-0 border-0"
          style={{ background: 'transparent', border: 'none', outline: 'none' }}
        />
      </div>
      
      <SlashCommandMenu
        editor={editor}
        isOpen={slashCommandOpen}
        onClose={handleSlashCommandClose}
        position={slashCommandPosition}
      />
    </>
  );
}