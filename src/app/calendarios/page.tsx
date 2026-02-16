'use client'
import events from '@/data/events.json';
import { useMemo, useState } from 'react';

function keyFromDate(d: Date){ return d.toISOString().slice(0,10); }

export default function Calendarios(){
  const [cursor,setCursor]=useState(new Date());
  const [cat,setCat]=useState('all');

  const days=useMemo(()=>{
    const y=cursor.getFullYear(); const m=cursor.getMonth();
    const filtered=(events as any[]).filter((e:any)=>{
      const d=new Date(e.start);
      return d.getMonth()===m && d.getFullYear()===y && (cat==='all'||e.category===cat);
    }).sort((a:any,b:any)=>+new Date(a.start)-+new Date(b.start));

    const map=new Map<string, any[]>();
    filtered.forEach((e:any)=>{
      const k=keyFromDate(new Date(e.start));
      if(!map.has(k)) map.set(k,[]);
      map.get(k)!.push(e);
    });
    return Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
  },[cursor,cat]);

  const cats=[...new Set((events as any[]).map((e:any)=>e.category).filter(Boolean))] as string[];

  return <div className='space-y-4'>
    <h1 className='text-3xl font-bold text-amber-900'>Calendario</h1>
    <p className='text-stone-700'>Vista por día. Cada tarjeta representa un día del mes con sus actividades.</p>
    <div className='flex flex-wrap gap-2 items-center'>
      <button className='border border-amber-300 rounded px-3 py-2 bg-white' onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()-1,1))}>← Mes anterior</button>
      <div className='font-semibold capitalize'>{cursor.toLocaleDateString('es-AR',{month:'long',year:'numeric'})}</div>
      <button className='border border-amber-300 rounded px-3 py-2 bg-white' onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()+1,1))}>Mes siguiente →</button>
      <select className='border border-amber-300 rounded px-3 py-2 ml-auto bg-white' value={cat} onChange={e=>setCat(e.target.value)}>
        <option value='all'>Todas las categorías</option>
        {cats.map(c=><option key={c} value={c}>{c}</option>)}
      </select>
    </div>

    <div className='space-y-4'>
      {days.length===0?<div className='bg-white border border-amber-100 rounded-xl p-4'>No hay actividades para este mes.</div>:
        days.map(([day,list])=>(
          <section key={day} className='bg-white border border-amber-100 rounded-xl p-4'>
            <h2 className='text-xl font-bold text-amber-800'>{new Date(day+'T00:00:00').toLocaleDateString('es-AR',{weekday:'long', day:'2-digit', month:'long'})}</h2>
            <ul className='mt-3 space-y-2'>
              {list.map((e:any)=>(
                <li key={e.id} className='border rounded-lg p-3'>
                  <p className='font-semibold'>{e.title}</p>
                  <p className='text-sm text-slate-600'>{new Date(e.start).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}{e.end?` - ${new Date(e.end).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}`:''} · {e.location || 'Basílica'}</p>
                  {(e.details||e.description) && <p className='text-sm mt-1'>{e.details||e.description}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))
      }
    </div>
  </div>
}
