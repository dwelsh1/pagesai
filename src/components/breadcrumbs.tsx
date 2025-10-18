'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Page {
  id: string;
  title: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState<Page | null>(null);

  // Extract page ID from pathname
  const pageId = pathname.startsWith('/pages/') ? pathname.split('/')[2] : null;

  // Load current page data
  useEffect(() => {
    if (pageId) {
      const loadPage = async () => {
        try {
          const response = await fetch(`/api/pages/${pageId}`);
          if (response.ok) {
            const page = await response.json();
            setCurrentPage(page);
          }
        } catch (error) {
          console.error('Error loading page for breadcrumbs:', error);
        }
      };
      loadPage();
    } else {
      setCurrentPage(null);
    }
  }, [pageId]);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
      {/* Home Icon and Link */}
      <Link href="/" className="flex items-center space-x-1 hover:text-gray-900 dark:hover:text-white">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Home</span>
      </Link>
      
      {/* Separator and Current Page */}
      {currentPage && (
        <>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-900 dark:text-white font-bold">
            {currentPage.title}
          </span>
        </>
      )}
    </nav>
  );
}