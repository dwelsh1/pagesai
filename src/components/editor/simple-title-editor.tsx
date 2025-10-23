'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, FileText } from 'lucide-react';

interface SimpleTitleEditorProps {
  pageId: string;
  initialTitle: string;
  onSave: (data: { title: string }) => Promise<void>;
  onCancel?: () => void;
}

export function SimpleTitleEditor({
  pageId,
  initialTitle,
  onSave,
  onCancel,
}: SimpleTitleEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a page title');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ title: title.trim() });
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to update page title. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Page Title</h1>
        </div>
        <div className="flex items-center space-x-2">
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
            title="Save changes"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Simple Form */}
      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title..."
              className="text-lg font-medium"
              autoFocus
            />
            <p className="text-sm text-gray-500">
              Only the page title can be edited here. Use the main page view to edit content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
