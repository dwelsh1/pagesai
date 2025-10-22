'use client';

import { BlockNoteViewEditor, BlockNoteContext } from '@blocknote/react';
import { BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, FileText } from 'lucide-react';

// Define the schema for our editor
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
  },
});

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
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize the editor
  useEffect(() => {
    const initializeEditor = async () => {
      const newEditor = BlockNoteEditor.create({
        schema,
        initialContent: initialContent ? JSON.parse(initialContent) : undefined,
      });

      setEditor(newEditor);

      // Listen for content changes
      newEditor.onChange(() => {
        setHasUnsavedChanges(true);
      });
    };

    initializeEditor();

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!editor || !hasUnsavedChanges) return;

    try {
      const content = JSON.stringify(editor.document);
      
      if (pageId) {
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
          throw new Error('Failed to auto-save');
        }
      }
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [editor, hasUnsavedChanges, pageId, title, description]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave, hasUnsavedChanges]);

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);
    try {
      const content = JSON.stringify(editor.document);
      
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

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

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
          <div className="min-h-[500px] border rounded-lg">
            <BlockNoteContext.Provider value={editor}>
              <BlockNoteViewEditor
                editor={editor}
                theme="light"
                className="prose max-w-none"
              />
            </BlockNoteContext.Provider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
