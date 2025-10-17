'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(()=>setMounted(true),[]);
  if(!mounted) return null;
  const next = theme === 'light' ? 'dark' : 'light';
  return <button aria-label="Toggle theme" className="border rounded px-2 py-1 text-sm" onClick={()=>setTheme(next)}>{next === 'dark' ? '🌙' : '☀️'}</button>;
}
export default ThemeToggle;
