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
    description: 'Make text inline code',
    icon: Code,
    command: (editor) => {
      editor.chain().focus().toggleCode().insertContent('code').run();
    },
    keywords: ['code', 'inline', 'monospace'],
    category: 'formatting'
  },
  
  // Structure
  {
    title: 'Heading 1',
    description: 'Large heading',
    icon: Heading1,
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).insertContent('Heading 1').run();
    },
    keywords: ['h1', 'heading1', 'title', 'large'],
    category: 'structure'
  },
  {
    title: 'Heading 2',
    description: 'Medium heading',
    icon: Heading2,
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).insertContent('Heading 2').run();
    },
    keywords: ['h2', 'heading2', 'subtitle', 'medium'],
    category: 'structure'
  },
  {
    title: 'Heading 3',
    description: 'Small heading',
    icon: Heading3,
    command: (editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).insertContent('Heading 3').run();
    },
    keywords: ['h3', 'heading3', 'small'],
    category: 'structure'
  },
  {
    title: 'Paragraph',
    description: 'Normal text',
    icon: Type,
    command: (editor) => {
      editor.chain().focus().setParagraph().insertContent('Type something...').run();
    },
    keywords: ['paragraph', 'normal', 'text', 'p'],
    category: 'structure'
  },
  {
    title: 'Bullet List',
    description: 'Create a bullet list',
    icon: List,
    command: (editor) => {
      editor.chain().focus().toggleBulletList().insertContent('List item').run();
    },
    keywords: ['bullet', 'list', 'ul', 'unordered'],
    category: 'structure'
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: ListOrdered,
    command: (editor) => {
      editor.chain().focus().toggleOrderedList().insertContent('List item').run();
    },
    keywords: ['numbered', 'ordered', 'ol', 'list'],
    category: 'structure'
  },
  {
    title: 'Quote',
    description: 'Create a blockquote',
    icon: Quote,
    command: (editor) => {
      editor.chain().focus().toggleBlockquote().insertContent('Quote').run();
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
      const url = window.prompt('Enter URL:');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    },
    keywords: ['link', 'url', 'href', 'a'],
    category: 'media'
  },
  {
    title: 'Image',
    description: 'Add an image',
    icon: Image,
    command: (editor) => {
      const url = window.prompt('Enter image URL:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
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
