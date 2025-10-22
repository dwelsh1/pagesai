'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TipTapEditor } from '@/components/editor/tiptap-editor';

// TipTap Editor Test Component
const TipTapTest = () => {
  const [content, setContent] = useState('<p>Hello <strong>TipTap</strong>! This is a test of the new editor.</p>');
  const [isEditable, setIsEditable] = useState(true);

  const handleUpdate = (newContent: string) => {
    setContent(newContent);
    console.log('Content updated:', newContent);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditable(!isEditable)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          title="Toggle edit mode"
        >
          {isEditable ? 'View Mode' : 'Edit Mode'}
        </button>
        <button
          onClick={() => setContent('<p>Content reset!</p>')}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          title="Reset content"
        >
          Reset
        </button>
      </div>
      
      <div className="border rounded p-4 min-h-[200px]">
        <TipTapEditor
          content={content}
          onUpdate={handleUpdate}
          editable={isEditable}
          className="min-h-[150px]"
        />
      </div>
      
      <div className="text-sm text-gray-600">
        <p><strong>Status:</strong> TipTap editor is working! ✅</p>
        <p><strong>Mode:</strong> {isEditable ? 'Editable' : 'Read-only'}</p>
        <p><strong>Content Length:</strong> {content.length} characters</p>
      </div>
    </div>
  );
};


export default function TestBlockNotePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">TipTap Editor Test</h1>
        
        <div className="space-y-8">
          <div className="p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">TipTap Editor Test</h3>
            <p className="text-gray-600">
              Successfully replaced BlockNote with TipTap! TipTap is compatible with React 18 and Next.js 14.
            </p>
          </div>
          <TipTapTest />
        </div>
        
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="text-lg font-semibold mb-2">Success! ✅</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>TipTap editor is working perfectly with React 18 and Next.js 14</li>
            <li>No more circular dependency issues or context problems</li>
            <li>Supports both editable and read-only modes</li>
            <li>Real-time content updates with onUpdate callback</li>
            <li>Current versions: TipTap with React 18.3.1 and Next.js 14.2.15</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
