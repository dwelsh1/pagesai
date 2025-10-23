'use client';

import { useCallback, useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Code, Underline, Type, List, ListOrdered, Quote, Link, Image } from 'lucide-react';
import { LinkModal } from './link-modal';

interface FloatingToolbarProps {
  editor: Editor;
}

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showLinkModal, setShowLinkModal] = useState(false);

  // Wrapper to track setIsVisible calls
  const setVisible = (visible: boolean) => {
    console.log(`setIsVisible called with: ${visible}, current: ${isVisible}`);
    setIsVisible(visible);
  };

  console.log('FloatingToolbar rendered, editor:', !!editor, 'isVisible:', isVisible);

  const updatePosition = useCallback(() => {
    if (!editor || typeof window === 'undefined') return;

    try {
      const { state } = editor;
      const { selection } = state;
      
      console.log('updatePosition called, selection empty:', selection.empty);
      
      // Only show toolbar if there's a text selection
      if (selection.empty) {
        console.log('Selection is empty, hiding toolbar');
        setVisible(false);
        return;
      }

      // Get the DOM coordinates of the selection
      const { from, to } = selection;
      const start = editor.view.coordsAtPos(from);
      const end = editor.view.coordsAtPos(to);

          // Calculate position for the toolbar - simplified approach
          const toolbarHeight = 40;
          const toolbarWidth = 120;
          
          // Use simpler positioning - raise it higher above the selection
          const top = Math.max(0, start.top - toolbarHeight - 16);
          const left = Math.max(0, (start.left + end.left) / 2 - toolbarWidth / 2);

      console.log('Start coords:', start);
      console.log('End coords:', end);
      console.log('Calculated position:', { top, left });
      console.log('Window dimensions:', { width: window.innerWidth, height: window.innerHeight });

      // Check if position is reasonable
      if (top < 0 || left < 0 || top > window.innerHeight || left > window.innerWidth) {
        console.warn('Position out of bounds, hiding toolbar');
        setVisible(false);
        return;
      }

      setPosition({ top, left });
      setVisible(true);
      console.log('Toolbar should be visible now, position:', { top, left });
    } catch (error) {
      console.warn('FloatingToolbar positioning error:', error);
      setVisible(false);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    try {
      console.log('Setting up FloatingToolbar event listeners');
      // Update position on selection changes
      editor.on('selectionUpdate', updatePosition);
      editor.on('transaction', updatePosition);

      // Don't hide on blur - let the toolbar stay visible until selection changes

      return () => {
        console.log('Cleaning up FloatingToolbar event listeners');
        editor.off('selectionUpdate', updatePosition);
        editor.off('transaction', updatePosition);
      };
    } catch (error) {
      console.warn('FloatingToolbar event setup error:', error);
    }
  }, [editor, updatePosition]);

  if (!isVisible || !editor) {
    return (
      <>
        <LinkModal
          isOpen={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          onConfirm={(url) => {
            try {
              editor.chain().focus().setLink({ href: url }).run();
              console.log('Link command executed with URL:', url);
            } catch (error) {
              console.warn('Link command error:', error);
            }
          }}
        />
      </>
    );
  }

  return (
    <>
      <div
        className="fixed z-50 flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg shadow-lg"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
      <button
        onClick={() => {
          try {
            console.log('Bold button clicked, editor active:', editor.isActive('bold'));
            editor.chain().focus().toggleBold().run();
            console.log('Bold command executed, now active:', editor.isActive('bold'));
          } catch (error) {
            console.warn('Bold toggle error:', error);
          }
        }}
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
        onClick={() => {
          try {
            console.log('Italic button clicked, editor active:', editor.isActive('italic'));
            editor.chain().focus().toggleItalic().run();
            console.log('Italic command executed, now active:', editor.isActive('italic'));
          } catch (error) {
            console.warn('Italic toggle error:', error);
          }
        }}
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
            onClick={() => {
              try {
                editor.chain().focus().toggleCode().run();
              } catch (error) {
                console.warn('Code toggle error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive('code') 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Code (Ctrl+E)"
          >
            <Code size={16} />
          </button>

          <button
            onClick={() => {
              try {
                console.log('Underline button clicked, editor active:', editor.isActive('underline'));
                editor.chain().focus().toggleUnderline().run();
                console.log('Underline command executed, now active:', editor.isActive('underline'));
              } catch (error) {
                console.warn('Underline toggle error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive('underline') 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Underline (Ctrl+U)"
          >
            <Underline size={16} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            onClick={() => {
              try {
                console.log('H1 button clicked');
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                console.log('H1 command executed');
              } catch (error) {
                console.warn('H1 toggle error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive('heading', { level: 1 }) 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Heading 1"
          >
            <span className="text-sm font-bold">H1</span>
          </button>

          <button
            onClick={() => {
              try {
                console.log('H2 button clicked');
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                console.log('H2 command executed');
              } catch (error) {
                console.warn('H2 toggle error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive('heading', { level: 2 }) 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Heading 2"
          >
            <span className="text-sm font-bold">H2</span>
          </button>

          <button
            onClick={() => {
              try {
                console.log('H3 button clicked');
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                console.log('H3 command executed');
              } catch (error) {
                console.warn('H3 toggle error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive('heading', { level: 3 }) 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Heading 3"
          >
            <span className="text-sm font-bold">H3</span>
          </button>

          <button
            onClick={() => {
              try {
                console.log('Paragraph button clicked');
                editor.chain().focus().setParagraph().run();
                console.log('Paragraph command executed');
              } catch (error) {
                console.warn('Paragraph toggle error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive('paragraph') 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Normal Text (Paragraph)"
          >
            <span className="text-sm font-bold">P</span>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            onClick={() => {
              try {
                console.log('Bullet List button clicked');
                editor.chain().focus().toggleBulletList().run();
                console.log('Bullet List command executed');
              } catch (error) {
                console.warn('Bullet List toggle error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive('bulletList') 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Bullet List"
          >
            <List size={16} />
          </button>

          <button
            onClick={() => {
              try {
                console.log('Ordered List button clicked');
                editor.chain().focus().toggleOrderedList().run();
                console.log('Ordered List command executed');
              } catch (error) {
                console.warn('Ordered List toggle error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive('orderedList') 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            onClick={() => {
              try {
                console.log('Blockquote button clicked');
                editor.chain().focus().toggleBlockquote().run();
                console.log('Blockquote command executed');
              } catch (error) {
                console.warn('Blockquote toggle error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive('blockquote') 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Quote (Blockquote)"
          >
            <Quote size={16} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            onClick={() => {
              try {
                console.log('Link button clicked');
                setShowLinkModal(true);
              } catch (error) {
                console.warn('Link toggle error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive('link') 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Add Link"
          >
            <Link size={16} />
          </button>

          <button
            onClick={() => {
              try {
                console.log('Image button clicked');
                const url = window.prompt('Enter image URL:');
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                  console.log('Image command executed with URL:', url);
                }
              } catch (error) {
                console.warn('Image toggle error:', error);
              }
            }}
            className="p-2 rounded-md transition-colors duration-200 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            title="Add Image"
          >
            <Image size={16} />
          </button>
        </div>

        <LinkModal
          isOpen={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          onConfirm={(url) => {
            try {
              editor.chain().focus().setLink({ href: url }).run();
              console.log('Link command executed with URL:', url);
            } catch (error) {
              console.warn('Link command error:', error);
            }
          }}
        />
      </>
    );
  }
