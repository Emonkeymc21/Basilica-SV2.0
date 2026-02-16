import Image from 'next/image';

async function getSaint(){
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/saint-of-day`,{cache:'no-store'}).catch(()=>null as any);
  if(!res || !res.ok) return null;
  return res.json();
}

export default async function Page(){
  const data = await getSaint();
  return <div className='space-y-4'>
    <h1 className='text-3xl font-bold'>Santo de Hoy</h1>
    {!data ? <p>No se pudo cargar ahora. Intentá nuevamente en unos minutos.</p> : <article className='bg-white border rounded-xl p-4 space-y-3'>
      <h2 className='text-xl font-semibold'>{data.name || data.title}</h2>
      {data.image && <Image src={data.image} alt={data.name || 'Santo'} width={800} height={500} className='rounded-lg w-full h-auto'/>}
      <p>{data.description}</p>
      {data.sourceUrl && <a href={data.sourceUrl} className='underline' target='_blank'>Fuente</a>}
      <p className='text-xs text-slate-500'>Origen: {data.source}</p>
    </article>}
  </div>
}
