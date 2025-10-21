'use client';

import { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCreatePage = () => {
    // TODO: Implement page creation
    console.log('Creating new page...');
  };

  const handleEditPage = (pageId: string) => {
    // TODO: Implement page editing
    console.log('Editing page:', pageId);
  };

  const handleDeletePage = (pageId: string) => {
    // TODO: Implement page deletion
    console.log('Deleting page:', pageId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar
            onCreatePage={handleCreatePage}
            onEditPage={handleEditPage}
            onDeletePage={handleDeletePage}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
