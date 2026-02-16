import announcements from '@/data/announcements.json';
import Link from 'next/link';
export default function Home(){
 return <div className='space-y-8'>
 <section className='grid md:grid-cols-2 gap-4'>
  <Link href='/cancionero' className='text-center text-xl font-semibold bg-amber-100 p-8 rounded-2xl'>Ir al Cancionero</Link>
  <Link href='/calendarios?today=1' className='text-center text-xl font-semibold bg-blue-100 p-8 rounded-2xl'>Actividades de hoy</Link>
 </section>
 <section><h2 className='text-2xl font-bold mb-3'>Novedades</h2><div className='grid md:grid-cols-2 gap-3'>{announcements.map(a=><article key={a.id} className='bg-white rounded-xl p-4 border'><h3 className='font-semibold'>{a.title}</h3><p>{a.summary}</p></article>)}</div></section>
 <section><h2 className='text-2xl font-bold mb-3'>Santo del día</h2><Link href='/santo-de-hoy' className='underline'>Ver santo de hoy</Link></section>
 </div>
}
