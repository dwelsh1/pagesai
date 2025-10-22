'use client';

import { useCallback, useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Underline } from 'lucide-react';

interface FloatingToolbarProps {
  editor: Editor;
}

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!editor) return;

    const { state } = editor;
    const { selection } = state;
    
    // Only show toolbar if there's a text selection
    if (selection.empty) {
      setIsVisible(false);
      return;
    }

    // Get the DOM coordinates of the selection
    const { from, to } = selection;
    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);

    // Calculate position for the toolbar
    const toolbarHeight = 40;
    const toolbarWidth = 120;
    
    const top = Math.max(0, start.top - toolbarHeight - 8);
    const left = Math.max(0, Math.min(
      (start.left + end.left) / 2 - toolbarWidth / 2,
      window.innerWidth - toolbarWidth - 16
    ));

    setPosition({ top, left });
    setIsVisible(true);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    // Update position on selection changes
    editor.on('selectionUpdate', updatePosition);
    editor.on('transaction', updatePosition);

    // Hide toolbar when editor loses focus
    editor.on('blur', () => setIsVisible(false));

    return () => {
      editor.off('selectionUpdate', updatePosition);
      editor.off('transaction', updatePosition);
      editor.off('blur', () => setIsVisible(false));
    };
  }, [editor, updatePosition]);

  if (!isVisible || !editor) {
    return null;
  }

  return (
    <div
      className="fixed z-50 flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive('bold') 
            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
        }`}
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive('italic') 
            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
        }`}
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-md transition-colors duration-200 ${
          editor.isActive('underline') 
            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
        }`}
        title="Underline (Ctrl+U)"
      >
        <Underline size={16} />
      </button>
    </div>
  );
}
