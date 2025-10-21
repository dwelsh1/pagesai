'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  FileText, 
  Folder, 
  FolderOpen, 
  Search, 
  ChevronRight, 
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Activity
} from 'lucide-react';

interface Page {
  id: string;
  title: string;
  children?: Page[];
  isExpanded?: boolean;
}

interface SidebarProps {
  pages?: Page[];
  onCreatePage?: () => void;
  onEditPage?: (pageId: string) => void;
  onDeletePage?: (pageId: string) => void;
}

export function Sidebar({ 
  pages = [], 
  onCreatePage, 
  onEditPage, 
  onDeletePage 
}: SidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);

  const handleCreatePage = () => {
    if (onCreatePage) {
      onCreatePage();
    } else {
      router.push('/dashboard/page/create');
    }
  };

  // Mock data for demonstration
  const mockPages: Page[] = [
    {
      id: '1',
      title: 'Getting Started',
      children: [
        { id: '1-1', title: 'Welcome to PagesAI' },
        { id: '1-2', title: 'First Steps' },
        { id: '1-3', title: 'Basic Features' }
      ]
    },
    {
      id: '2',
      title: 'Documentation',
      children: [
        { id: '2-1', title: 'API Reference' },
        { id: '2-2', title: 'User Guide' },
        { id: '2-3', title: 'Troubleshooting' }
      ]
    },
    {
      id: '3',
      title: 'Projects',
      children: [
        { id: '3-1', title: 'Project Alpha' },
        { id: '3-2', title: 'Project Beta' }
      ]
    },
    { id: '4', title: 'Personal Notes' },
    { id: '5', title: 'Meeting Notes' }
  ];

  const displayPages = pages.length > 0 ? pages : mockPages;

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const filteredPages = displayPages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.children?.some(child => 
      child.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const renderPage = (page: Page, level = 0) => {
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedPages.has(page.id);
    const indentClass = `pl-${level * 4}`;

    return (
      <div key={page.id} className="group">
        <div className={`flex items-center justify-between py-1 px-2 hover:bg-gray-100 rounded-md ${indentClass}`}>
          <div className="flex items-center flex-1 min-w-0">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(page.id)}
                className="p-1 hover:bg-gray-200 rounded mr-1"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-5 mr-1" /> // Spacer for alignment
            )}
            
            <Link
              href={`/dashboard/page/${page.id}`}
              className="flex items-center flex-1 min-w-0 text-sm text-gray-700 hover:text-gray-900"
            >
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                ) : (
                  <Folder className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                )
              ) : (
                <FileText className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              )}
              <span className="truncate">{page.title}</span>
            </Link>
          </div>

          {/* Context Menu Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShowContextMenu(showContextMenu === page.id ? null : page.id)}
              title="Page options"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>

            {/* Context Menu */}
            {showContextMenu === page.id && (
              <div className="absolute right-0 top-6 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    onEditPage?.(page.id);
                    setShowContextMenu(null);
                  }}
                  className="flex items-center w-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDeletePage?.(page.id);
                    setShowContextMenu(null);
                  }}
                  className="flex items-center w-full px-3 py-1 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {page.children?.map(child => renderPage(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Pages</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCreatePage}
            className="h-6 w-6"
            title="Create new page"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
          <Input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-8 text-xs bg-white border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredPages.length > 0 ? (
          <div className="space-y-1">
            {filteredPages.map(page => renderPage(page))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No pages found</p>
            {searchQuery && (
              <p className="text-xs mt-1">Try a different search term</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/diagnostics">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            title="Open System Diagnostics"
          >
            <Activity className="h-4 w-4 mr-2" />
            Diagnostics
          </Button>
        </Link>
      </div>
    </aside>
  );
}
