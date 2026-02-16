'use client'
import events from '@/data/events.json';
import Image from 'next/image';
import { useMemo, useState } from 'react';

type Evt = {id:string;title:string;start:string;end?:string;location?:string;details?:string;description?:string;category?:string};

function ymdLocal(d: Date){
  const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

export default function Calendarios(){
  const [cursor,setCursor]=useState(new Date());
  const [view,setView]=useState<'agenda'|'mes'>('agenda');

  const y=cursor.getFullYear(); const m=cursor.getMonth();
  const firstDay=new Date(y,m,1);
  const monthName=cursor.toLocaleDateString('es-AR',{month:'long',year:'numeric'});

  const monthEvents = useMemo(()=> (events as Evt[]).filter(e=>{
    const d=new Date(e.start); return d.getFullYear()===y && d.getMonth()===m;
  }).sort((a,b)=> +new Date(a.start)- +new Date(b.start)),[y,m]);

  const byDay = useMemo(()=>{
    const map = new Map<string, Evt[]>();
    monthEvents.forEach(e=>{
      const k = ymdLocal(new Date(e.start));
      if(!map.has(k)) map.set(k,[]);
      map.get(k)!.push(e);
    });
    return map;
  },[monthEvents]);

  const daysInMonth = new Date(y,m+1,0).getDate();
  const pad = firstDay.getDay(); // 0 sunday
  const cells = Array.from({length:pad},()=>null).concat(Array.from({length:daysInMonth},(_,i)=>i+1));

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-3'>
        <button aria-label='volver' className='h-9 w-9 rounded-xl bg-white border border-slate-200' onClick={()=>history.back()}>←</button>
        <h1 className='text-3xl font-bold text-slate-900'>Calendario</h1>
      </div>

      <section className='bg-white/80 rounded-2xl border border-slate-200 p-3 shadow-sm'>
        <div className='flex items-center justify-between'>
          <button className='h-10 w-10 rounded-xl border bg-white' onClick={()=>setCursor(new Date(y,m-1,1))}>◀</button>
          <div className='text-2xl font-semibold capitalize'>{monthName}</div>
          <button className='h-10 w-10 rounded-xl border bg-white' onClick={()=>setCursor(new Date(y,m+1,1))}>▶</button>
        </div>
      </section>

      <div className='flex gap-2'>
        <button onClick={()=>setView('agenda')} className={`px-4 py-2 rounded-full border ${view==='agenda'?'bg-blue-50 border-blue-400 shadow':'bg-white border-slate-300'}`}>Agenda</button>
        <button onClick={()=>setView('mes')} className={`px-4 py-2 rounded-full border ${view==='mes'?'bg-blue-50 border-blue-400 shadow':'bg-white border-slate-300'}`}>Mes</button>
      </div>

      {view==='agenda' && <div className='space-y-3'>
        {monthEvents.length===0 && <div className='bg-white rounded-2xl border p-4'>No hay actividades para este mes.</div>}
        {monthEvents.map(e=><article key={e.id} className='bg-white rounded-2xl border border-slate-200 p-4'>
          <h3 className='text-2xl font-bold text-slate-900'>{e.title}</h3>
          <p className='text-sm text-slate-600'>
            {new Date(e.start).toLocaleDateString('es-AR')} · {new Date(e.start).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}
            {e.end?`-${new Date(e.end).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}`:''} · {e.location || 'Basílica San Vicente Ferrer'}
          </p>
          {(e.details||e.description) && <p className='mt-2 text-xl text-slate-800'>{e.details||e.description}</p>}
        </article>)}
      </div>}

      <div className='grid grid-cols-7 gap-2'>
        {['D','L','M','M','J','V','S'].map((w,i)=><div key={i} className='text-center text-sm text-slate-500'>{w}</div>)}
        {cells.map((d,idx)=>{
          if(!d) return <div key={idx} />;
          const key=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          const list = byDay.get(key) || [];
          return <div key={idx} className='min-h-20 rounded-2xl border border-slate-200 bg-white p-2'>
            <div className='font-bold'>{d}</div>
            <div className='mt-1 space-y-1'>
              {list.slice(0,2).map(ev=><div key={ev.id} className='h-2 w-2 rounded-full bg-amber-500' title={ev.title}></div>)}
            </div>
          </div>
        })}
      </div>
    </div>
  )
}
