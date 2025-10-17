'use client';
import { useState } from 'react';
import { ThemeToggle } from '@/src/components/theme-toggle';
import { useRouter } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  currentPageTitle?: string;
}

export default function Header({ breadcrumbs = [], currentPageTitle }: HeaderProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const router = useRouter();

  const handleNewPage = async () => {
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled' }),
      });
      
      if (response.ok) {
        const page = await response.json();
        router.push(`/pages/${page.id}`);
      }
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Pages</h1>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* New Page Button */}
          <button
            onClick={handleNewPage}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Create new page"
            data-testid="new-page-button"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          {/* Templates Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Templates (coming soon)"
            data-testid="templates-button"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>

        {/* Center Section - Breadcrumbs */}
        <div className="flex items-center space-x-2">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <a href="/" className="hover:text-gray-900 dark:hover:text-white">Home</a>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span>/</span>
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-gray-900 dark:hover:text-white">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-900 dark:text-white">{crumb.label}</span>
                )}
              </div>
            ))}
            {currentPageTitle && (
              <div className="flex items-center space-x-2">
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">{currentPageTitle}</span>
              </div>
            )}
          </nav>
        </div>

        {/* Right Section - User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            data-testid="user-menu-button"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">admin</span>
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  data-testid="logout-button"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
