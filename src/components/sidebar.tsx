'use client';
import { useEffect, useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from '@/src/components/sortable-item';

type Page = { id: string; title: string; parentPageId?: string | null; favorite: boolean };

export default function Sidebar() {
  const [pages, setPages] = useState<Page[]>([]);
  const [q, setQ] = useState('');
  const [width, setWidth] = useState(280);

  useEffect(()=>{ fetch('/api/pages').then(r=>r.json()).then(setPages); },[]);
  const sensors = useSensors(useSensor(PointerSensor));

  function onDragEnd(event:any) {
    const {active, over} = event;
    if(!over || active.id === over.id) return;
    const ids = pages.map(p=>p.id);
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    const newPages = arrayMove(pages, oldIndex, newIndex);
    setPages(newPages);
    fetch('/api/pages/reorder', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ order: newPages.map((p,i)=>({ id: p.id, sortIndex: i })) })
    });
  }

  const filtered = q ? pages.filter(p=>p.title.toLowerCase().includes(q.toLowerCase())) : pages;

  return (
    <aside className="border-r relative" style={{ width }}>
      <div className="flex items-center gap-2 p-2">
        <input placeholder="Search pages..." className="w-full border rounded px-2 py-1 text-sm" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      <nav className="px-2">
        <h3 className="text-xs uppercase opacity-60 px-1 mb-1">Favorites</h3>
        {filtered.filter(p=>p.favorite).map(p=>(
          <a key={p.id} href={'/pages/'+p.id} className="block px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">{p.title}</a>
        ))}
        <h3 className="text-xs uppercase opacity-60 px-1 mt-3 mb-1">All Pages</h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={filtered.map(p=>p.id)} strategy={verticalListSortingStrategy}>
            {filtered.map(p => (
              <SortableItem key={p.id} id={p.id}>
                <a href={'/pages/'+p.id} className="block px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">{p.title}</a>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </nav>
      <div
        onMouseDown={(e)=>{
          const startX = e.clientX; const startW = width;
          function move(ev: MouseEvent){ setWidth(Math.max(220, Math.min(420, startW + (ev.clientX - startX)))); }
          function up(){ window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); }
          window.addEventListener('mousemove', move);
          window.addEventListener('mouseup', up);
        }}
        className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent"
      />
    </aside>
  );
}
