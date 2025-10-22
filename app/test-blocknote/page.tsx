'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Wrapper component to handle BlockNote context properly (client-side only)
const BlockNoteWrapper = dynamic(
  () => Promise.resolve(() => {
    const { useCreateBlockNote, BlockNoteContext } = require('@blocknote/react');
    const editor = useCreateBlockNote();
    
    return (
      <BlockNoteContext.Provider value={editor}>
        <div className="space-y-8">
          <DirectBlockNoteTest editor={editor} />
          <DynamicBlockNoteTest editor={editor} />
          <SimpleHTMLTest />
        </div>
      </BlockNoteContext.Provider>
    );
  }),
  { 
    ssr: false,
    loading: () => <div className="p-4">Loading BlockNote context...</div>
  }
);

// Test 1: Direct import using BlockNoteViewEditor
const DirectBlockNoteTest = dynamic(
  () => Promise.resolve(({ editor }: { editor: any }) => {
    const { BlockNoteViewEditor } = require('@blocknote/react');

    return (
      <div className="p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Test 1: BlockNoteViewEditor</h3>
        <BlockNoteViewEditor 
          editor={editor}
          className="min-h-[200px] border rounded p-2"
        />
      </div>
    );
  }),
  { 
    ssr: false,
    loading: () => <div className="p-4">Loading direct component...</div>
  }
);

// Test 2: Dynamic import using BlockNoteViewEditor
const DynamicBlockNoteTest = dynamic(
  () => import('@blocknote/react').then((mod) => ({ 
    default: ({ editor }: { editor: any }) => {
      const { BlockNoteViewEditor } = mod;

      return (
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Test 2: Dynamic BlockNoteViewEditor</h3>
          <BlockNoteViewEditor 
            editor={editor}
            className="min-h-[200px] border rounded p-2"
          />
        </div>
      );
    }
  })),
  { 
    ssr: false,
    loading: () => <div className="p-4">Loading dynamic component...</div>
  }
);

// Test 3: Simple HTML renderer (fallback)
function SimpleHTMLTest() {
  const content = [
    {
      id: '3',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Hello from simple HTML renderer!',
          styles: {},
        },
      ],
      children: [],
    },
  ];

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Test 3: Simple HTML Renderer</h3>
      <div className="min-h-[200px] border rounded p-2">
        {content.map((block) => (
          <p key={block.id}>
            {block.content.map((textNode, index) => (
              <span key={index}>{textNode.text}</span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function TestBlockNotePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">BlockNote Editor Tests</h1>
        
        <BlockNoteWrapper />
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Test 1 should work with direct imports</li>
            <li>Test 2 tests dynamic imports (what we're using)</li>
            <li>Test 3 is a fallback HTML renderer</li>
            <li>Try clicking in each editor to see which ones work</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
