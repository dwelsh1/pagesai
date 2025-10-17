'use client';
import dynamic from 'next/dynamic';

// Dynamically import BlockNote components to avoid SSR issues
const FormattingToolbar = dynamic(
  () => import('@blocknote/react').then((mod) => ({ default: mod.FormattingToolbar })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center space-x-2 p-2">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-8 rounded"></div>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-8 rounded"></div>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-8 rounded"></div>
      </div>
    )
  }
);

interface BlockNoteToolbarProps {
  editor: any;
}

export default function BlockNoteToolbar({ editor }: BlockNoteToolbarProps) {
  if (!editor) {
    return (
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Loading toolbar...
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800">
      <FormattingToolbar editor={editor} />
    </div>
  );
}
