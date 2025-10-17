'use client';
import { ReactNode } from 'react';
import Sidebar from '@/src/components/sidebar';
import { ThemeToggle } from '@/src/components/theme-toggle';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen grid grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="h-14 border-b flex items-center justify-between px-4 gap-3">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold">Pages</h1>
            <button id="btn-new-page" className="border rounded px-2 py-1 text-sm" onClick={async ()=>{
              const res = await fetch('/api/pages', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ title: 'Untitled' }) });
              if(res.ok) location.reload();
            }}>+</button>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action="/api/auth/logout" method="post">
              <button className="text-sm border rounded px-2 py-1">Logout</button>
            </form>
          </div>
        </header>
        <main className="overflow-auto">{children}</main>
      </div>
    </div>
  );
}
