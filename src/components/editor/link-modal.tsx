'use client';

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { X, Link as LinkIcon } from 'lucide-react';

interface LinkModalProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

export function LinkModal({ editor, isOpen, onClose }: LinkModalProps) {
  const [url, setUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const handleSubmit = () => {
    if (url.trim()) {
      // If there's selected text, use it as link text, otherwise use the provided text
      const text = linkText.trim() || editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        ' '
      );
      
      if (text) {
        // Replace selected text with link
        editor.chain().focus().insertContent(`<a href="${url.trim()}">${text}</a>`).run();
      } else {
        // Insert link with URL as text
        editor.chain().focus().insertContent(`<a href="${url.trim()}">${url.trim()}</a>`).run();
      }
    }
    setUrl('');
    setLinkText('');
    onClose();
  };

  const handleClose = () => {
    setUrl('');
    setLinkText('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Insert Link</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Text
            </label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Text to display (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <div className="flex items-center space-x-2">
              <LinkIcon className="w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!url.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
