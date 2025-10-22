'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, LogOut, Settings, Home, ChevronRight, FileText, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export function Header() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageTitle, setCurrentPageTitle] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch page title when on a page route
  useEffect(() => {
    const fetchPageTitle = async () => {
      // Check if we're on a page route (e.g., /dashboard/page/[id])
      const pageMatch = pathname.match(/^\/dashboard\/page\/([^\/]+)$/);
      if (pageMatch) {
        const pageId = pageMatch[1];
        try {
          const response = await fetch(`/api/pages/${pageId}`);
          if (response.ok) {
            const { page } = await response.json();
            setCurrentPageTitle(page.title);
          } else {
            setCurrentPageTitle(null);
          }
        } catch (error) {
          console.error('Failed to fetch page title:', error);
          setCurrentPageTitle(null);
        }
      } else {
        setCurrentPageTitle(null);
      }
    };

    fetchPageTitle();
  }, [pathname]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the search container
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Only close if we're not clicking on a search result button
        const target = event.target as HTMLElement;
        if (!target.closest('[data-search-result]')) {
          setShowSearchResults(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/pages/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Search results received:', data.pages);
          setSearchResults(data.pages || []);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      // Navigate to the first search result
      router.push(`/dashboard/page/${searchResults[0].id}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const handleSearchResultClick = (pageId: string) => {
    console.log('🔍 Header: Search result clicked, pageId:', pageId);
    console.log('🔍 Header: Current URL before navigation:', window.location.pathname);
    console.log('🔍 Header: Navigating to:', `/dashboard/page/${pageId}`);
    
    // Force navigation
    router.push(`/dashboard/page/${pageId}`);
    
    console.log('🔍 Header: Router push called');
    setShowSearchResults(false);
    setSearchQuery('');
    
    // Force a page reload to ensure navigation happens
    setTimeout(() => {
      console.log('🔍 Header: Current URL after navigation:', window.location.pathname);
      if (window.location.pathname === `/dashboard/page/${pageId}`) {
        console.log('🔍 Header: Navigation successful');
      } else {
        console.log('🔍 Header: Navigation failed, forcing reload');
        window.location.href = `/dashboard/page/${pageId}`;
      }
    }, 100);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    inputRef.current?.focus();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">PagesAI</span>
          </Link>
          
          {/* Search Bar */}
          <div ref={searchRef} className="hidden md:block relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  className="pl-10 pr-10 w-64 bg-gray-50 border-gray-200 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  </div>
                )}
              </div>
            </form>

      {/* Breadcrumbs positioned right after search box */}
      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 flex items-center space-x-2 text-sm text-gray-600 whitespace-nowrap">
              <Link href="/dashboard" className="flex items-center space-x-1 hover:text-gray-900">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              {currentPageTitle && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-gray-900 font-medium">{currentPageTitle}</span>
                </>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔍 Search dropdown clicked - preventing form submission');
                }}
              >
                {searchResults.length > 0 ? (
                  <div className="py-1">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        data-search-result="true"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🔍 Search result button clicked:', result.id, result.title);
                          handleSearchResultClick(result.id);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <div className="flex items-start space-x-3">
                          <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {result.title}
                            </div>
                            {result.description && (
                              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {result.description}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 mt-1">
                              Updated {new Date(result.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery.trim() && !isSearching ? (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    No pages found for "{searchQuery}"
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            title="Search pages"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            title="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* User Dropdown */}
          {user && (
            <div ref={userDropdownRef} className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 hover:bg-gray-100 rounded-md p-1"
                title="User menu"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      {user.username}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Signout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden mt-4">
        <div ref={searchRef} className="relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                className="pl-10 pr-10 w-full bg-gray-50 border-gray-200 focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                </div>
              )}
            </div>
          </form>

          {/* Mobile Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="py-1">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSearchResultClick(result.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </div>
                          {result.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {result.description}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            Updated {new Date(result.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery.trim() && !isSearching ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No pages found for "{searchQuery}"
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
