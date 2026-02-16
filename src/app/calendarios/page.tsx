'use client'
import events from '@/data/events.json';
import { useMemo, useState } from 'react';

export default function Calendarios(){
  const [cursor,setCursor]=useState(new Date());
  const [cat,setCat]=useState('all');
  const monthEvents=useMemo(()=>events.filter((e:any)=>{const d=new Date(e.start); return d.getMonth()===cursor.getMonth()&&d.getFullYear()===cursor.getFullYear()&&(cat==='all'||e.category===cat)}).sort((a:any,b:any)=>+new Date(a.start)-+new Date(b.start)),[cursor,cat]);
  const cats=[...new Set((events as any[]).map(e=>e.category))];
  return <div className='space-y-4'>
    <h1 className='text-3xl font-bold'>Calendarios</h1>
    <div className='flex flex-wrap gap-2 items-center'>
      <button className='border rounded px-3 py-2' onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()-1,1))}>←</button>
      <div className='font-semibold'>{cursor.toLocaleDateString('es-AR',{month:'long',year:'numeric'})}</div>
      <button className='border rounded px-3 py-2' onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()+1,1))}>→</button>
      <select className='border rounded px-3 py-2 ml-auto' value={cat} onChange={e=>setCat(e.target.value)}><option value='all'>Todas</option>{cats.map(c=><option key={c}>{c}</option>)}</select>
    </div>
    <div className='bg-white border rounded-xl p-4 space-y-3'>
      {monthEvents.length===0?<p>No hay actividades para este mes.</p>:monthEvents.map((e:any)=><article key={e.id} className='border rounded p-3'><h3 className='font-semibold'>{e.title}</h3><p className='text-sm text-slate-600'>{new Date(e.start).toLocaleString('es-AR')} {e.end?`- ${new Date(e.end).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}`:''}</p><p className='text-sm'>{e.location}</p><p className='text-sm'>{e.details||e.description}</p></article>)}
    </div>
  </div>
}
