'use client'
import events from '@/data/events.json';
import { useMemo, useState } from 'react';

type Evt = {id:string;title:string;start:string;end?:string;location?:string;details?:string;description?:string;category?:string};

function ymdLocal(d: Date){
  const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

function buildRecurringForMonth(y:number,m:number): Evt[] {
  const out: Evt[] = [];
  const days = new Date(y,m+1,0).getDate();

  for(let d=1; d<=days; d++){
    const date = new Date(y,m,d);
    const wd = date.getDay(); // 0 dom,2 mar,4 jue,5 vie,6 sab
    const mm = String(m+1).padStart(2,'0');
    const dd = String(d).padStart(2,'0');
    const yyyy = String(y);

    // MISAS
    if(wd>=1 && wd<=5) out.push({id:`misa8-${yyyy}${mm}${dd}`,title:'Misa',start:`${yyyy}-${mm}-${dd}T08:00:00`,end:`${yyyy}-${mm}-${dd}T09:00:00`,location:'Basílica San Vicente Ferrer',details:'Misa de lunes a viernes 8:00 hs',category:'horario-fijo'});
    if(wd>=2 && wd<=5) out.push({id:`misa20mv-${yyyy}${mm}${dd}`,title:'Misa',start:`${yyyy}-${mm}-${dd}T20:00:00`,end:`${yyyy}-${mm}-${dd}T21:00:00`,location:'Basílica San Vicente Ferrer',details:'Misa martes a viernes 20:00 hs',category:'horario-fijo'});
    if(wd===6) out.push({id:`misa20s-${yyyy}${mm}${dd}`,title:'Misa',start:`${yyyy}-${mm}-${dd}T20:00:00`,end:`${yyyy}-${mm}-${dd}T21:00:00`,location:'Basílica San Vicente Ferrer',details:'Misa sábado 20:00 hs',category:'horario-fijo'});
    if(wd===0){
      out.push({id:`misa11d-${yyyy}${mm}${dd}`,title:'Misa',start:`${yyyy}-${mm}-${dd}T11:00:00`,end:`${yyyy}-${mm}-${dd}T12:00:00`,location:'Basílica San Vicente Ferrer',details:'Misa domingo 11:00 hs',category:'horario-fijo'});
      out.push({id:`misa20d-${yyyy}${mm}${dd}`,title:'Misa',start:`${yyyy}-${mm}-${dd}T20:00:00`,end:`${yyyy}-${mm}-${dd}T21:00:00`,location:'Basílica San Vicente Ferrer',details:'Misa domingo 20:00 hs',category:'horario-fijo'});
    }

    // CONFESIONES
    if(wd===2) out.push({id:`confmar-${yyyy}${mm}${dd}`,title:'Confesiones',start:`${yyyy}-${mm}-${dd}T18:00:00`,end:`${yyyy}-${mm}-${dd}T20:00:00`,location:'Basílica San Vicente Ferrer',details:'Martes 18:00 a 20:00 hs',category:'horario-fijo'});
    if(wd===5){
      out.push({id:`confvie1-${yyyy}${mm}${dd}`,title:'Confesiones',start:`${yyyy}-${mm}-${dd}T09:00:00`,end:`${yyyy}-${mm}-${dd}T12:00:00`,location:'Basílica San Vicente Ferrer',details:'Viernes 09:00 a 12:00 hs',category:'horario-fijo'});
      out.push({id:`confvie2-${yyyy}${mm}${dd}`,title:'Confesiones',start:`${yyyy}-${mm}-${dd}T17:00:00`,end:`${yyyy}-${mm}-${dd}T20:00:00`,location:'Basílica San Vicente Ferrer',details:'Viernes 17:00 a 20:00 hs',category:'horario-fijo'});
    }

    // ADORACIÓN
    if(wd===4) out.push({id:`adorjue-${yyyy}${mm}${dd}`,title:'Adoración Eucarística',start:`${yyyy}-${mm}-${dd}T18:00:00`,end:`${yyyy}-${mm}-${dd}T19:30:00`,location:'Basílica San Vicente Ferrer',details:'Jueves 18:00 a 19:30 hs',category:'horario-fijo'});
    if(wd===5) out.push({id:`adorvie-${yyyy}${mm}${dd}`,title:'Adoración Eucarística',start:`${yyyy}-${mm}-${dd}T08:30:00`,end:`${yyyy}-${mm}-${dd}T10:00:00`,location:'Basílica San Vicente Ferrer',details:'Viernes 08:30 a 10:00 hs',category:'horario-fijo'});
  }
  return out;
}

export default function Calendarios(){
  const [cursor,setCursor]=useState(new Date());
  const [view,setView]=useState<'agenda'|'mes'>('agenda');

  const y=cursor.getFullYear(); const m=cursor.getMonth();
  const firstDay=new Date(y,m,1);
  const monthName=cursor.toLocaleDateString('es-AR',{month:'long',year:'numeric'});

  const monthEvents = useMemo(()=> {
    const base = (events as Evt[]).filter(e=>{
      const d=new Date(e.start); return d.getFullYear()===y && d.getMonth()===m;
    });
    const recurring = buildRecurringForMonth(y,m);
    return [...base, ...recurring].sort((a,b)=> +new Date(a.start)- +new Date(b.start));
  },[y,m]);

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

  const emptyCells: (number | null)[] = Array.from({ length: pad }, () => null as number | null);
  const dayCells: (number | null)[] = Array.from({ length: daysInMonth }, (_, i) => (i + 1) as number | null);
  const cells: (number | null)[] = [...emptyCells, ...dayCells];

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
              {list.slice(0,3).map(ev=><div key={ev.id} className='h-2 w-2 rounded-full bg-amber-500' title={ev.title}></div>)}
            </div>
          </div>
        })}
      </div>
    </div>
  )
}
