'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, FileText } from 'lucide-react';

interface SimplePageCreatorProps {
  onSave?: (data: { title: string }) => void;
  onCancel?: () => void;
}

export function SimplePageCreator({
  onSave,
  onCancel,
}: SimplePageCreatorProps) {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a page title');
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({ title: title.trim() });
      } else {
        // Create new page directly
        const response = await fetch('/api/pages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim(),
            content: '', // Empty content initially
            description: '', // Empty description initially
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create page');
        }

        const { page } = await response.json();
        // Redirect to the new page
        window.location.href = `/dashboard/page/${page.id}`;
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to create page. Please try again.');
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Create New Page</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            title="Cancel page creation"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            size="sm"
            title="Create page"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Creating...' : 'Create Page'}
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
              onKeyDown={handleKeyDown}
              placeholder="Enter page title..."
              className="text-lg font-medium"
              autoFocus
            />
            <p className="text-sm text-gray-500">
              You can add content to your page after creating it.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
