'use client';
import { ReactNode } from 'react';
import Sidebar from '@/src/components/sidebar';
import Header from '@/src/components/header';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Page Content - Full Width */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
