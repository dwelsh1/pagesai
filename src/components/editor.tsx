'use client';
import { useEffect, useState } from 'react';

export default function Editor({ pageId }: { pageId: string | null }) {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  useEffect(()=>{
    if(!pageId) return;
    (async()=>{
      const r = await fetch('/api/pages/'+pageId);
      if(r.ok){ 
        const p = await r.json(); 
        setContent(p.contentJson?.content || ''); 
        setTitle(p.title || '');
      }
    })();
  },[pageId]);

  async function onContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if(!pageId) return;
    const newContent = e.target.value;
    setContent(newContent);
    await fetch('/api/pages/'+pageId, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ contentJson: { content: newContent } })
    });
  }

  async function onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if(!pageId) return;
    const newTitle = e.target.value;
    setTitle(newTitle);
    await fetch('/api/pages/'+pageId, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ title: newTitle })
    });
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="text-sm font-medium mb-2">Simple Text Editor (BlockNote integration coming soon)</div>
      <div className="border rounded">
        {pageId ? (
          <div className="p-4 space-y-4">
            <input
              type="text"
              value={title}
              onChange={onTitleChange}
              placeholder="Page title..."
              className="w-full text-2xl font-bold border-none outline-none bg-transparent"
            />
            <textarea
              value={content}
              onChange={onContentChange}
              placeholder="Start writing..."
              className="w-full h-96 border-none outline-none resize-none bg-transparent"
            />
          </div>
        ) : (
          <p className="p-4 opacity-70">Create your first page…</p>
        )}
      </div>
    </div>
  );
}
