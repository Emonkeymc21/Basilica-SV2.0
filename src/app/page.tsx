import announcements from '@/data/announcements.json';
import events from '@/data/events.json';
import Link from 'next/link';
import Image from 'next/image';

export default function Home(){
 const today = new Date().toISOString().slice(0,10);
 const todayEvents = (events as any[]).filter((e:any)=> e.start?.slice(0,10)===today).slice(0,5);
 const destacadas=['/images/horarios-primavera-verano.png','/images/catequesis-familiar.png','/images/misa-enfermos.png'];

 return <div className='space-y-8'>
 <section className='rounded-2xl overflow-hidden border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 md:p-8'>
   <div className='grid md:grid-cols-2 gap-6 items-center'>
    <div>
      <h1 className='text-3xl md:text-4xl font-bold text-amber-900'>Basílica San Vicente Ferrer</h1>
      <p className='mt-3 text-stone-700'>Bienvenidos a la web pastoral. Encontrá horarios, calendario, canciones, oraciones y novedades de la comunidad.</p>
      <div className='mt-5 flex flex-wrap gap-3'>
        <Link href='/calendarios' className='px-4 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700'>Ver calendario día por día</Link>
        <Link href='/cancionero' className='px-4 py-3 rounded-xl bg-white border border-amber-300 font-semibold text-amber-900'>Ir al cancionero</Link>
      </div>
    </div>
    <div className='grid grid-cols-3 gap-2'>
      {destacadas.map((src)=> <div key={src} className='relative h-40 rounded-xl overflow-hidden border border-amber-200'><Image src={src} alt='Actividad parroquial' fill className='object-cover'/></div>)}
    </div>
   </div>
 </section>
 <section><h2 className='text-2xl font-bold mb-3 text-amber-900'>Novedades</h2><div className='grid md:grid-cols-2 gap-3'>{(announcements as any[]).map((a:any)=><article key={a.id} className='bg-white rounded-xl p-4 border border-amber-100'><h3 className='font-semibold'>{a.title}</h3><p className='text-sm text-slate-700'>{a.summary}</p>{a.when && <p className='text-xs text-slate-500 mt-2'>{a.when}</p>}</article>)}</div></section>
 <section className='bg-white rounded-xl p-4 border border-amber-100'><h2 className='text-2xl font-bold mb-3 text-amber-900'>Santo del día</h2><Link href='/santo-de-hoy' className='underline'>Ver santo de hoy</Link></section>
 <section className='bg-white rounded-xl p-4 border border-amber-100'><h2 className='text-2xl font-bold mb-3 text-amber-900'>Actividades de hoy</h2>{todayEvents.length? <ul className='space-y-2'>{todayEvents.map((e:any)=><li key={e.id} className='border rounded p-3 border-amber-100'><b>{e.title}</b><div className='text-sm text-slate-600'>{new Date(e.start).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})} · {e.location}</div></li>)}</ul>:<p>No hay actividades cargadas para hoy.</p>}</section>
 </div>
}
