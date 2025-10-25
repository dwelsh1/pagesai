'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FileText, 
  Folder, 
  FolderOpen, 
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
  onDeletePage?: (pageId: string, pageTitle: string) => void;
}

export function Sidebar({ 
  pages, 
  onCreatePage, 
  onEditPage, 
  onDeletePage 
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
  const [fetchedPages, setFetchedPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get current page ID from pathname
  const currentPageId = pathname.includes('/dashboard/page/') 
    ? pathname.split('/dashboard/page/')[1]?.split('/')[0]
    : null;

  // Get current page name
  const currentPageName = currentPageId 
    ? fetchedPages.find(page => page.id === currentPageId)?.title || 'Unknown Page'
    : null;

  console.log('📱 Sidebar: Current pathname:', pathname);
  console.log('📱 Sidebar: Current pageId:', currentPageId);
  if (currentPageName) {
    console.log('📱 Sidebar: Current pageName:', currentPageName);
  }

  // Fetch pages from API
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch('/api/pages');
        if (response.ok) {
          const data = await response.json();
          const pagesData = data.pages.map((page: any) => ({
            id: page.id,
            title: page.title,
            children: []
          }));
          setFetchedPages(pagesData);
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, []);

  const handleCreatePage = () => {
    if (onCreatePage) {
      onCreatePage();
    } else {
      router.push('/dashboard/page/create');
    }
  };

  // Mock data for demonstration (fallback)
  const mockPages: Page[] = [
    {
      id: 'test-page-1',
      title: 'Welcome to PagesAI',
      children: []
    },
    {
      id: 'test-page-2',
      title: 'Sample Document',
      children: []
    }
  ];

  const displayPages = pages || fetchedPages.length > 0 ? (pages || fetchedPages) : mockPages;

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const renderPage = (page: Page, level = 0) => {
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedPages.has(page.id);
    const isActive = currentPageId === page.id;
    const indentClass = `pl-${level * 4}`;

    return (
      <div key={page.id} className="group">
        <div className={`flex items-center justify-between py-1 px-2 hover:bg-gray-100 rounded-md ${indentClass} ${
          isActive ? 'bg-blue-50 border-l-2 border-blue-500' : ''
        }`}>
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
              className={`flex items-center flex-1 min-w-0 text-sm hover:text-gray-900 ${
                isActive ? 'text-blue-700 font-medium' : 'text-gray-700'
              }`}
            >
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                ) : (
                  <Folder className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                )
              ) : (
                <FileText className={`h-4 w-4 mr-2 flex-shrink-0 ${
                  isActive ? 'text-blue-500' : 'text-gray-400'
                }`} />
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
                    onDeletePage?.(page.id, page.title);
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
        <div className="flex items-center justify-between">
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
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-sm">Loading pages...</p>
          </div>
        ) : displayPages.length > 0 ? (
          <div className="space-y-1">
            {displayPages.map(page => renderPage(page))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No pages found</p>
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
