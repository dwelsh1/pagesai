'use client';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  currentPageTitle?: string;
}

export default function Breadcrumbs({ items, currentPageTitle }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
      <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span>/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-900 dark:hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white">{item.label}</span>
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
  );
}
