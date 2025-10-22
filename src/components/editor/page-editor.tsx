'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, FileText } from 'lucide-react';
import { TipTapEditor } from '@/components/editor/tiptap-editor';

interface PageEditorProps {
  pageId?: string;
  initialTitle?: string;
  initialContent?: string;
  initialDescription?: string;
  onSave?: (data: { title: string; content: string; description?: string }) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function PageEditor({
  pageId,
  initialTitle = '',
  initialContent = '',
  initialDescription = '',
  onSave,
  onCancel,
  isEditing = false,
}: PageEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!hasUnsavedChanges || !pageId) return;

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to auto-save');
      }
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [hasUnsavedChanges, pageId, title, content, description]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave, hasUnsavedChanges]);

  const handleContentUpdate = useCallback((newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          title,
          content,
          description,
        });
      } else if (pageId) {
        // Update existing page
        const response = await fetch(`/api/pages/${pageId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            description,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save page');
        }
      } else {
        // Create new page
        const response = await fetch('/api/pages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            description,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create page');
        }

        const { page } = await response.json();
        // Redirect to the new page
        window.location.href = `/dashboard/page/${page.id}`;
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    
    if (onCancel) {
      onCancel();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Page' : 'Create New Page'}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <span className="text-sm text-orange-600">Unsaved changes</span>
          )}
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            title="Cancel editing"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            size="sm"
            title="Save page"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Page Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Enter page title..."
              className="text-lg font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Enter page description..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[500px] border rounded-lg p-4">
            <TipTapEditor
              content={content}
              onUpdate={handleContentUpdate}
              editable={true}
              className="prose max-w-none min-h-[400px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}