import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Code, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Undo,
  Redo
} from 'lucide-react';

export interface SlashCommand {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  command: (editor: Editor) => void;
  keywords: string[];
  category: 'formatting' | 'structure' | 'alignment' | 'media' | 'utility';
}

export const slashCommands: SlashCommand[] = [
  // Formatting
  {
    title: 'Bold',
    description: 'Make text bold',
    icon: Bold,
    command: (editor) => editor.chain().focus().toggleBold().run(),
    keywords: ['bold', 'strong', 'b'],
    category: 'formatting'
  },
  {
    title: 'Italic',
    description: 'Make text italic',
    icon: Italic,
    command: (editor) => editor.chain().focus().toggleItalic().run(),
    keywords: ['italic', 'em', 'i'],
    category: 'formatting'
  },
  {
    title: 'Code',
    description: 'Create a code block',
    icon: Code,
    command: (editor) => {
      editor.chain().focus().toggleCodeBlock().run();
      // Insert placeholder text after the code block is created
      setTimeout(() => {
        editor.commands.insertContent('code');
        // Select just the placeholder text, not all content
        const { from, to } = editor.state.selection;
        editor.commands.setTextSelection({ from: from - 4, to: to });
      }, 10);
    },
    keywords: ['code', 'block', 'monospace', 'pre'],
    category: 'structure'
  },
  
  // Structure
  {
    title: 'Heading 1',
    description: 'Large heading',
    icon: Heading1,
    command: (editor) => {
      // Insert heading with placeholder text in one operation
      editor.chain().focus().setHeading({ level: 1 }).insertContent('Heading 1').run();
      // Select the placeholder text so it can be replaced
      setTimeout(() => {
        const { from, to } = editor.state.selection;
        editor.commands.setTextSelection({ from: from - 9, to: to });
      }, 10);
    },
    keywords: ['h1', 'heading1', 'title', 'large'],
    category: 'structure'
  },
  {
    title: 'Heading 2',
    description: 'Medium heading',
    icon: Heading2,
    command: (editor) => {
      // Insert heading with placeholder text in one operation
      editor.chain().focus().setHeading({ level: 2 }).insertContent('Heading 2').run();
      // Select the placeholder text so it can be replaced
      setTimeout(() => {
        const { from, to } = editor.state.selection;
        editor.commands.setTextSelection({ from: from - 9, to: to });
      }, 10);
    },
    keywords: ['h2', 'heading2', 'subtitle', 'medium'],
    category: 'structure'
  },
  {
    title: 'Heading 3',
    description: 'Small heading',
    icon: Heading3,
    command: (editor) => {
      // Insert heading with placeholder text in one operation
      editor.chain().focus().setHeading({ level: 3 }).insertContent('Heading 3').run();
      // Select the placeholder text so it can be replaced
      setTimeout(() => {
        const { from, to } = editor.state.selection;
        editor.commands.setTextSelection({ from: from - 9, to: to });
      }, 10);
    },
    keywords: ['h3', 'heading3', 'small'],
    category: 'structure'
  },
  {
    title: 'Paragraph',
    description: 'Normal text',
    icon: Type,
    command: (editor) => {
      editor.chain().focus().setParagraph().run();
      // Insert placeholder text after the paragraph is created
      setTimeout(() => {
        editor.commands.insertContent('Type something...');
        editor.commands.selectAll();
      }, 10);
    },
    keywords: ['paragraph', 'normal', 'text', 'p'],
    category: 'structure'
  },
  {
    title: 'Bullet List',
    description: 'Create a bullet list',
    icon: List,
    command: (editor) => {
      editor.chain().focus().toggleBulletList().run();
      // Insert placeholder text after the list is created
      setTimeout(() => {
        editor.commands.insertContent('List item');
        editor.commands.selectAll();
      }, 10);
    },
    keywords: ['bullet', 'list', 'ul', 'unordered'],
    category: 'structure'
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: ListOrdered,
    command: (editor) => {
      editor.chain().focus().toggleOrderedList().run();
      // Insert placeholder text after the list is created
      setTimeout(() => {
        editor.commands.insertContent('List item');
        editor.commands.selectAll();
      }, 10);
    },
    keywords: ['numbered', 'ordered', 'ol', 'list'],
    category: 'structure'
  },
  {
    title: 'Quote',
    description: 'Create a blockquote',
    icon: Quote,
    command: (editor) => {
      editor.chain().focus().toggleBlockquote().run();
      // Insert placeholder text after the quote is created
      setTimeout(() => {
        editor.commands.insertContent('Quote');
        editor.commands.selectAll();
      }, 10);
    },
    keywords: ['quote', 'blockquote', 'citation'],
    category: 'structure'
  },
  
  // Alignment
  {
    title: 'Align Left',
    description: 'Align text to the left',
    icon: AlignLeft,
    command: (editor) => editor.chain().focus().setTextAlign('left').run(),
    keywords: ['left', 'align', 'l'],
    category: 'alignment'
  },
  {
    title: 'Align Center',
    description: 'Center align text',
    icon: AlignCenter,
    command: (editor) => editor.chain().focus().setTextAlign('center').run(),
    keywords: ['center', 'centre', 'align', 'c'],
    category: 'alignment'
  },
  {
    title: 'Align Right',
    description: 'Align text to the right',
    icon: AlignRight,
    command: (editor) => editor.chain().focus().setTextAlign('right').run(),
    keywords: ['right', 'align', 'r'],
    category: 'alignment'
  },
  {
    title: 'Justify',
    description: 'Justify text alignment',
    icon: AlignJustify,
    command: (editor) => editor.chain().focus().setTextAlign('justify').run(),
    keywords: ['justify', 'align', 'j'],
    category: 'alignment'
  },
  
  // Media
  {
    title: 'Link',
    description: 'Add a link',
    icon: Link,
    command: (editor) => {
      console.log('🔗 LINK COMMAND EXECUTED');
      console.log('🔗 Editor state:', {
        hasFocus: editor.isFocused,
        selection: editor.state.selection,
        content: editor.getHTML()
      });
      
      // Trigger the link modal by dispatching a custom event
      const customEvent = new CustomEvent('openLinkModal', {
        detail: { editor }
      });
      console.log('🔗 Dispatching openLinkModal event:', customEvent);
      window.dispatchEvent(customEvent);
    },
    keywords: ['link', 'url', 'href', 'a'],
    category: 'media'
  },
  {
    title: 'Image',
    description: 'Add an image',
    icon: Image,
    command: (editor) => {
      // Trigger the image modal by dispatching a custom event
      const customEvent = new CustomEvent('openImageModal', {
        detail: { editor }
      });
      window.dispatchEvent(customEvent);
    },
    keywords: ['image', 'img', 'picture', 'photo'],
    category: 'media'
  },
  
  // Utility
  {
    title: 'Undo',
    description: 'Undo last action',
    icon: Undo,
    command: (editor) => editor.chain().focus().undo().run(),
    keywords: ['undo', 'back', 'revert'],
    category: 'utility'
  },
  {
    title: 'Redo',
    description: 'Redo last action',
    icon: Redo,
    command: (editor) => editor.chain().focus().redo().run(),
    keywords: ['redo', 'forward', 'repeat'],
    category: 'utility'
  }
];

export const getFilteredCommands = (query: string): SlashCommand[] => {
  if (!query) return slashCommands;
  
  const lowercaseQuery = query.toLowerCase();
  
  return slashCommands.filter(command => 
    command.title.toLowerCase().includes(lowercaseQuery) ||
    command.description.toLowerCase().includes(lowercaseQuery) ||
    command.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
  );
};

export const getCommandsByCategory = (commands: SlashCommand[]) => {
  const categories = {
    formatting: commands.filter(cmd => cmd.category === 'formatting'),
    structure: commands.filter(cmd => cmd.category === 'structure'),
    alignment: commands.filter(cmd => cmd.category === 'alignment'),
    media: commands.filter(cmd => cmd.category === 'media'),
    utility: commands.filter(cmd => cmd.category === 'utility')
  };
  
  return categories;
};
