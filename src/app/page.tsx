import announcements from '@/data/announcements.json';
import events from '@/data/events.json';
import Link from 'next/link';

export default function Home(){
 const today = new Date().toISOString().slice(0,10);
 const todayEvents = events.filter((e:any)=> e.start?.slice(0,10)===today).slice(0,5);
 return <div className='space-y-8'>
 <section className='grid md:grid-cols-2 gap-4'>
  <Link href='/cancionero' className='text-center text-xl font-semibold bg-amber-100 p-8 rounded-2xl'>Ir al Cancionero</Link>
  <Link href='/calendarios?today=1' className='text-center text-xl font-semibold bg-blue-100 p-8 rounded-2xl'>Calendario del día</Link>
 </section>
 <section><h2 className='text-2xl font-bold mb-3'>Novedades</h2><div className='grid md:grid-cols-2 gap-3'>{announcements.map((a:any)=><article key={a.id} className='bg-white rounded-xl p-4 border'><h3 className='font-semibold'>{a.title}</h3><p className='text-sm text-slate-700'>{a.summary}</p>{a.when && <p className='text-xs text-slate-500 mt-2'>{a.when}</p>}</article>)}</div></section>
 <section className='bg-white rounded-xl p-4 border'><h2 className='text-2xl font-bold mb-3'>Santo del día</h2><Link href='/santo-de-hoy' className='underline'>Ver santo de hoy</Link></section>
 <section className='bg-white rounded-xl p-4 border'><h2 className='text-2xl font-bold mb-3'>Actividades de hoy</h2>{todayEvents.length? <ul className='space-y-2'>{todayEvents.map((e:any)=><li key={e.id} className='border rounded p-3'><b>{e.title}</b><div className='text-sm text-slate-600'>{new Date(e.start).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})} · {e.location}</div></li>)}</ul>:<p>No hay actividades cargadas para hoy.</p>}</section>
 </div>
}
