'use client'
import events from '@/data/events.json';
import { useMemo, useState } from 'react';

type Evt = {id:string;title:string;start:string;end?:string;location?:string;details?:string;description?:string;category?:string};

function ymdLocal(d: Date){
  const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

function eventType(e: Evt): 'misa'|'confesion'|'adoracion'|'liturgia'|'actividad' {
  const t = (e.title || '').toLowerCase();
  const c = (e.category || '').toLowerCase();
  if (c.includes('liturg')) return 'liturgia';
  if (t.includes('confesi')) return 'confesion';
  if (t.includes('adoración') || t.includes('adoracion')) return 'adoracion';
  if (t.includes('misa')) return 'misa';
  return 'actividad';
}

const typeColor: Record<ReturnType<typeof eventType>, string> = {
  misa: 'bg-blue-500',
  confesion: 'bg-violet-500',
  adoracion: 'bg-amber-500',
  liturgia: 'bg-rose-500',
  actividad: 'bg-emerald-500',
};

const typeLabel: Record<ReturnType<typeof eventType>, string> = {
  misa: 'Misa',
  confesion: 'Confesión',
  adoracion: 'Adoración',
  liturgia: 'Liturgia',
  actividad: 'Actividad',
};

function buildRecurringForMonth(y:number,m:number): Evt[] {
  const out: Evt[] = [];
  const days = new Date(y,m+1,0).getDate();

  for(let d=1; d<=days; d++){
    const date = new Date(y,m,d);
    const wd = date.getDay();
    const mm = String(m+1).padStart(2,'0');
    const dd = String(d).padStart(2,'0');
    const yyyy = String(y);
    const dayKey = `${yyyy}-${mm}-${dd}`;
    if (dayKey >= '2026-03-29') continue;

    if(wd>=1 && wd<=5) out.push({id:`misa8-${yyyy}${mm}${dd}`,title:'Misa',start:`${yyyy}-${mm}-${dd}T08:00:00`,end:`${yyyy}-${mm}-${dd}T09:00:00`,location:'Basílica San Vicente Ferrer',details:'Misa de lunes a viernes 8:00 hs',category:'horario-fijo'});
    if(wd>=2 && wd<=5) out.push({id:`misa20mv-${yyyy}${mm}${dd}`,title:'Misa',start:`${yyyy}-${mm}-${dd}T20:00:00`,end:`${yyyy}-${mm}-${dd}T21:00:00`,location:'Basílica San Vicente Ferrer',details:'Misa martes a viernes 20:00 hs',category:'horario-fijo'});
    if(wd===6) out.push({id:`misa20s-${yyyy}${mm}${dd}`,title:'Misa',start:`${yyyy}-${mm}-${dd}T20:00:00`,end:`${yyyy}-${mm}-${dd}T21:00:00`,location:'Basílica San Vicente Ferrer',details:'Misa sábado 20:00 hs',category:'horario-fijo'});
    if(wd===0){
      out.push({id:`misa11d-${yyyy}${mm}${dd}`,title:'Misa',start:`${yyyy}-${mm}-${dd}T11:00:00`,end:`${yyyy}-${mm}-${dd}T12:00:00`,location:'Basílica San Vicente Ferrer',details:'Misa domingo 11:00 hs',category:'horario-fijo'});
      out.push({id:`misa20d-${yyyy}${mm}${dd}`,title:'Misa',start:`${yyyy}-${mm}-${dd}T20:00:00`,end:`${yyyy}-${mm}-${dd}T21:00:00`,location:'Basílica San Vicente Ferrer',details:'Misa domingo 20:00 hs',category:'horario-fijo'});
    }

    if(wd===2) out.push({id:`confmar-${yyyy}${mm}${dd}`,title:'Confesiones',start:`${yyyy}-${mm}-${dd}T18:00:00`,end:`${yyyy}-${mm}-${dd}T20:00:00`,location:'Basílica San Vicente Ferrer',details:'Martes 18:00 a 20:00 hs',category:'horario-fijo'});
    if(wd===5){
      out.push({id:`confvie1-${yyyy}${mm}${dd}`,title:'Confesiones',start:`${yyyy}-${mm}-${dd}T09:00:00`,end:`${yyyy}-${mm}-${dd}T12:00:00`,location:'Basílica San Vicente Ferrer',details:'Viernes 09:00 a 12:00 hs',category:'horario-fijo'});
      out.push({id:`confvie2-${yyyy}${mm}${dd}`,title:'Confesiones',start:`${yyyy}-${mm}-${dd}T17:00:00`,end:`${yyyy}-${mm}-${dd}T20:00:00`,location:'Basílica San Vicente Ferrer',details:'Viernes 17:00 a 20:00 hs',category:'horario-fijo'});
    }

    if(wd===4) out.push({id:`adorjue-${yyyy}${mm}${dd}`,title:'Adoración Eucarística',start:`${yyyy}-${mm}-${dd}T18:00:00`,end:`${yyyy}-${mm}-${dd}T19:30:00`,location:'Basílica San Vicente Ferrer',details:'Jueves 18:00 a 19:30 hs',category:'horario-fijo'});
    if(wd===5) out.push({id:`adorvie-${yyyy}${mm}${dd}`,title:'Adoración Eucarística',start:`${yyyy}-${mm}-${dd}T08:30:00`,end:`${yyyy}-${mm}-${dd}T10:00:00`,location:'Basílica San Vicente Ferrer',details:'Viernes 08:30 a 10:00 hs',category:'horario-fijo'});
  }
  return out;
}




function buildHolyWeekForMonth(y:number,m:number): Evt[] {
  const all: Evt[] = [];
  const add = (date:string,title:string,details:string) => all.push({
    id:`holy-${date}-${title}`, title, start:`${date}T00:00:00`, location:'Basílica San Vicente Ferrer', details, category:'liturgia'
  });
  add('2026-03-29','Semana Santa: Domingo de Ramos','Inicio de Semana Santa');
  add('2026-03-30','Semana Santa','Lunes Santo');
  add('2026-03-31','Semana Santa','Martes Santo');
  add('2026-04-01','Semana Santa','Miércoles Santo');
  add('2026-04-02','Semana Santa: Jueves Santo','Triduo Pascual');
  add('2026-04-03','Semana Santa: Viernes Santo','Pasión del Señor');
  add('2026-04-04','Semana Santa: Sábado Santo','Vigilia Pascual');
  add('2026-04-05','Semana Santa: Domingo de Pascua','Resurrección del Señor');
  return all.filter(e=>{
    const d=new Date(e.start);
    return d.getFullYear()===y && d.getMonth()===m;
  });
}

function buildLiturgicalForMonth(y:number,m:number): Evt[] {
  const out: Evt[] = [];
  const days = new Date(y,m+1,0).getDate();
  for(let d=1; d<=days; d++){
    const wd = new Date(y,m,d).getDay();
    const mm = String(m+1).padStart(2,'0');
    const dd = String(d).padStart(2,'0');
    const yyyy = String(y);
    const dayKey = `${yyyy}-${mm}-${dd}`;
    if (dayKey >= '2026-03-29') continue;
    if (wd===0) {
      out.push({id:`lit-dom-${yyyy}${mm}${dd}`,title:'Celebración dominical',start:`${yyyy}-${mm}-${dd}T00:00:00`,location:'Basílica San Vicente Ferrer',details:'Domingo: celebración litúrgica del día',category:'liturgia'});
    }
  }
  return out;
}
export default function Calendarios(){
  const [cursor,setCursor]=useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const holyStart = '2026-03-29';
  const holyEnd = '2026-04-05';

  const y=cursor.getFullYear(); const m=cursor.getMonth();
  const firstDay=new Date(y,m,1);
  const monthName=cursor.toLocaleDateString('es-AR',{month:'long',year:'numeric'});

  const monthEvents = useMemo(()=> {
    const base = (events as Evt[]).filter(e=>{
      const d=new Date(e.start); return d.getFullYear()===y && d.getMonth()===m;
    });
    const recurring = buildRecurringForMonth(y,m);
    const liturgical = buildLiturgicalForMonth(y,m);
    const holy = buildHolyWeekForMonth(y,m);
    return [...base, ...recurring, ...liturgical, ...holy].sort((a,b)=> +new Date(a.start)- +new Date(b.start));
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
  const pad = firstDay.getDay();
  const emptyCells: (number | null)[] = Array.from({ length: pad }, () => null as number | null);
  const dayCells: (number | null)[] = Array.from({ length: daysInMonth }, (_, i) => (i + 1) as number | null);
  const cells: (number | null)[] = [...emptyCells, ...dayCells];

  const selectedKey = selectedDay ? `${y}-${String(m+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}` : null;
  const selectedEvents = selectedKey ? (byDay.get(selectedKey) || []) : [];

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-3'>
        <button aria-label='volver' className='h-9 w-9 rounded-xl bg-white border border-slate-200' onClick={()=>history.back()}>←</button>
        <h1 className='text-3xl font-bold text-slate-900'>Calendario</h1>
      </div>

      <section className='bg-white/80 rounded-2xl border border-slate-200 p-3 shadow-sm'>
        <div className='flex items-center justify-between'>
          <button className='h-10 w-10 rounded-xl border bg-white' onClick={()=>{setCursor(new Date(y,m-1,1)); setSelectedDay(1);}}>◀</button>
          <div className='text-2xl font-semibold capitalize'>{monthName}</div>
          <button className='h-10 w-10 rounded-xl border bg-white' onClick={()=>{setCursor(new Date(y,m+1,1)); setSelectedDay(1);}}>▶</button>
        </div>
      </section>
      <div className='flex flex-wrap gap-3 text-xs text-slate-600'>
          {(['misa','confesion','adoracion','liturgia','actividad'] as const).map(t => (
            <span key={t} className='inline-flex items-center gap-1'>
              <span className={`h-2.5 w-2.5 rounded-full ${typeColor[t]}`} /> {typeLabel[t]}
            </span>
          ))}
      </div>
      </div>