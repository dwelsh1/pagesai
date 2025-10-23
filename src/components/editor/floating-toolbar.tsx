'use client';

import { useCallback, useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Code, Underline, Type, List, ListOrdered, Quote, Link, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { LinkModal } from './link-modal';
import { ImageModal } from './image-modal';

interface FloatingToolbarProps {
  editor: Editor;
}

export function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

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

      // Calculate position for the toolbar - responsive approach
      const toolbarHeight = 40;
      const viewportWidth = window.innerWidth;
      
      // Responsive toolbar width based on viewport
      let toolbarWidth;
      if (viewportWidth < 768) {
        toolbarWidth = Math.min(viewportWidth - 40, 350); // Mobile: smaller toolbar
      } else if (viewportWidth < 1024) {
        toolbarWidth = Math.min(viewportWidth - 60, 450); // Tablet: medium toolbar
      } else {
        toolbarWidth = Math.min(viewportWidth - 80, 500); // Desktop: full toolbar
      }
      
      // Calculate center position of selection
      const selectionCenter = (start.left + end.left) / 2;
      
      // Position toolbar above selection with better bounds checking
      const top = Math.max(10, start.top - toolbarHeight - 16);
      
      // Calculate left position with viewport bounds checking
      let left = selectionCenter - toolbarWidth / 2;
      
      // Ensure toolbar stays within viewport bounds with more margin
      const margin = 20; // Increased margin for better visibility
      const minLeft = margin;
      const maxLeft = viewportWidth - toolbarWidth - margin;
      
      if (left < minLeft) {
        left = minLeft;
      } else if (left > maxLeft) {
        left = maxLeft;
      }
      
      // Additional check: if toolbar would still be cut off, try centering it
      if (left + toolbarWidth > viewportWidth - margin) {
        left = Math.max(margin, viewportWidth - toolbarWidth - margin);
      }

      console.log('Start coords:', start);
      console.log('End coords:', end);
      console.log('Selection center:', selectionCenter);
      console.log('Calculated position:', { top, left });
      console.log('Window dimensions:', { width: window.innerWidth, height: window.innerHeight });
      console.log('Toolbar dimensions:', { width: toolbarWidth, height: toolbarHeight });

      // Final bounds check - ensure toolbar is visible
      if (top < 0 || top > window.innerHeight - toolbarHeight) {
        console.warn('Toolbar would be off-screen vertically, trying fallback positioning');
        
        // Try positioning below the selection instead
        const fallbackTop = Math.min(window.innerHeight - toolbarHeight - 10, end.bottom + 8);
        if (fallbackTop > end.bottom) {
          setPosition({ top: fallbackTop, left });
          setVisible(true);
          console.log('Toolbar positioned below selection:', { top: fallbackTop, left });
          return;
        } else {
          console.warn('No suitable position found, hiding toolbar');
          setVisible(false);
          return;
        }
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

      // Add window resize listener to recalculate positioning
      const handleResize = () => {
        if (isVisible) {
          updatePosition();
        }
      };
      window.addEventListener('resize', handleResize);

      // Don't hide on blur - let the toolbar stay visible until selection changes

      return () => {
        console.log('Cleaning up FloatingToolbar event listeners');
        editor.off('selectionUpdate', updatePosition);
        editor.off('transaction', updatePosition);
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.warn('FloatingToolbar event setup error:', error);
    }
  }, [editor, updatePosition, isVisible]);

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

        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          onConfirm={(url) => {
            try {
              editor.chain().focus().setImage({ src: url }).run();
              console.log('Image command executed with URL:', url);
            } catch (error) {
              console.warn('Image command error:', error);
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
                editor.chain().focus().setTextAlign('left').run();
              } catch (error) {
                console.warn('Text align left error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive({ textAlign: 'left' }) 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>

          <button
            onClick={() => {
              try {
                editor.chain().focus().setTextAlign('center').run();
              } catch (error) {
                console.warn('Text align center error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive({ textAlign: 'center' }) 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>

          <button
            onClick={() => {
              try {
                editor.chain().focus().setTextAlign('right').run();
              } catch (error) {
                console.warn('Text align right error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive({ textAlign: 'right' }) 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>

          <button
            onClick={() => {
              try {
                editor.chain().focus().setTextAlign('justify').run();
              } catch (error) {
                console.warn('Text align justify error:', error);
              }
            }}
            className={`p-2 rounded-md transition-colors duration-200 ${
              editor.isActive({ textAlign: 'justify' }) 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            title="Justify"
          >
            <AlignJustify size={16} />
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
                setShowImageModal(true);
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

        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          onConfirm={(url) => {
            try {
              editor.chain().focus().setImage({ src: url }).run();
              console.log('Image command executed with URL:', url);
            } catch (error) {
              console.warn('Image command error:', error);
            }
          }}
        />
      </>
    );
  }
