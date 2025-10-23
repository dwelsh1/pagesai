'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  Type, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Link, 
  Image 
} from 'lucide-react';
import { LinkModal } from './link-modal';
import { ImageModal } from './image-modal';

interface FloatingToolbarProps {
  editor: Editor;
}

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!editor || !editor.view) return;

    const { state } = editor;
    const { selection } = state;
    const { empty } = selection;

    console.log('FloatingToolbar updatePosition called, selection empty:', empty);

    if (empty) {
      console.log('Selection is empty, hiding toolbar');
      setIsVisible(false);
      return;
    }

    try {
      const { from, to } = selection;
      const start = editor.view.coordsAtPos(from);
      const end = editor.view.coordsAtPos(to);

      console.log('Start coords:', start);
      console.log('End coords:', end);

      const toolbarWidth = 700; // Further increased width to fit all buttons
      const toolbarHeight = 40;
      const margin = 50; // Increased margin

      // Calculate position
      const top = Math.max(start.top - toolbarHeight - margin, margin);
      const left = Math.max(
        Math.min(
          start.left + (end.left - start.left) / 2 - toolbarWidth / 2,
          window.innerWidth - toolbarWidth - margin
        ),
        margin
      );

      const calculatedPosition = { top, left };
      console.log('Calculated position:', calculatedPosition);
      console.log('Window dimensions:', { width: window.innerWidth, height: window.innerHeight });

      setPosition(calculatedPosition);
      setIsVisible(true);
      console.log('Toolbar should be visible now, position:', calculatedPosition);
    } catch (error) {
      console.error('Error calculating toolbar position:', error);
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (!editor) return;

    console.log('Setting up FloatingToolbar event listeners');

    const handleSelectionUpdate = () => {
      updatePosition();
    };

    const handleResize = () => {
      updatePosition();
    };

    // Listen for selection changes
    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('transaction', handleSelectionUpdate);

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    // Initial position update
    updatePosition();

    return () => {
      console.log('Cleaning up FloatingToolbar event listeners');
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('transaction', handleSelectionUpdate);
      window.removeEventListener('resize', handleResize);
    };
  }, [editor]);

  if (!isVisible || !editor) {
    return null;
  }

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex items-center space-x-1"
      style={{
        top: position.top,
        left: position.left,
        width: '700px',
      }}
    >
      {/* Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Structure */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('paragraph') ? 'bg-gray-200' : ''}`}
        title="Paragraph"
      >
        <Type className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => {
          console.log('Justify button clicked');
          console.log('Editor is active justify:', editor.isActive({ textAlign: 'justify' }));
          editor.chain().focus().setTextAlign('justify').run();
          console.log('Justify command executed');
          console.log('Editor HTML after justify:', editor.getHTML());
        }}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}`}
        title="Align Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Media */}
      <button
        onClick={() => setLinkModalOpen(true)}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        title="Link"
      >
        <Link className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => setImageModalOpen(true)}
        className="p-2 rounded hover:bg-gray-100"
        title="Image"
      >
        <Image className="w-4 h-4" />
      </button>
    </div>
    
    {/* Modals */}
    <LinkModal
      editor={editor}
      isOpen={linkModalOpen}
      onClose={() => setLinkModalOpen(false)}
    />
    
    <ImageModal
      editor={editor}
      isOpen={imageModalOpen}
      onClose={() => setImageModalOpen(false)}
    />
  </div>
);
}
