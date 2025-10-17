import '../styles/globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export const metadata = { title: 'PagesAI', description: 'Notion-like app' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
