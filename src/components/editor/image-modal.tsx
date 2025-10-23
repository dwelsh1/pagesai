'use client';

import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';

interface ImageModalProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ editor, isOpen, onClose }: ImageModalProps) {
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUrl(''); // Clear URL when file is selected
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    if (event.target.value) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!url && !selectedFile) return;

    setIsUploading(true);

    try {
      let imageSrc = '';

      if (selectedFile) {
        // Convert file to data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          imageSrc = e.target?.result as string;
          editor.chain().focus().setImage({ src: imageSrc }).run();
          onClose();
          setIsUploading(false);
        };
        reader.readAsDataURL(selectedFile);
      } else if (url) {
        // Use URL directly
        editor.chain().focus().setImage({ src: url }).run();
        onClose();
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error inserting image:', error);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Insert Image</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image File
            </label>
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleBrowseClick}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                <span>Browse Files</span>
              </button>
              {selectedFile && (
                <span className="text-sm text-gray-600">
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-32 object-contain border border-gray-200 rounded"
              />
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* URL Input Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <div className="flex items-center space-x-2">
              <LinkIcon className="w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={(!url && !selectedFile) || isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Inserting...' : 'Insert Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
