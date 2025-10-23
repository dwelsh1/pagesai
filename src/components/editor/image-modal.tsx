'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string) => void;
}

export function ImageModal({ isOpen, onClose, onConfirm }: ImageModalProps) {
  const [url, setUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(''); // Clear URL when modal opens
      setImageFile(null); // Clear file when modal opens
      setImagePreview(''); // Clear preview when modal opens
      // Focus on the input field when the modal opens
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Small delay to ensure modal is rendered
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Cleanup preview URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUrl(''); // Clear URL when file is selected
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (e.target.value) {
      setImageFile(null); // Clear file when URL is entered
      setImagePreview(''); // Clear preview when URL is entered
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFile) {
      // Convert file to data URL for embedding
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onConfirm(dataUrl);
        onClose();
      };
      reader.readAsDataURL(imageFile);
    } else if (url.trim()) {
      onConfirm(url.trim());
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Image</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Choose Image File</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="whitespace-nowrap"
              >
                Browse
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">or</div>

          <div className="space-y-2">
            <Label htmlFor="url">Image URL</Label>
            <Input
              ref={inputRef}
              id="url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={handleUrlChange}
              className="w-full"
            />
          </div>

          {imagePreview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border rounded-lg p-2 bg-gray-50">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-auto max-h-32 mx-auto rounded"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!url.trim() && !imageFile}>
              Add Image
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
