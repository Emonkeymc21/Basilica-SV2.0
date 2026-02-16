'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';

type SaintData = {
  name?: string;
  title?: string;
  description?: string;
  image?: string;
  sourceUrl?: string;
  source?: string;
};

export default function Page(){
  const [data,setData]=useState<SaintData|null>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    let ok=true;
    fetch('/api/saint-of-day',{cache:'no-store'})
      .then(r=>r.ok?r.json():null)
      .then(j=>{ if(ok) setData(j); })
      .catch(()=>{ if(ok) setData(null); })
      .finally(()=>{ if(ok) setLoading(false); });
    return ()=>{ ok=false; }
  },[]);

  return <div className='space-y-4'>
    <h1 className='text-3xl font-bold'>Santo de Hoy</h1>
    {loading ? <p>Cargando...</p> : !data ? <p>No se pudo cargar ahora. Intentá nuevamente en unos minutos.</p> : <article className='bg-white border rounded-xl p-4 space-y-3'>
      <h2 className='text-xl font-semibold'>{data.name || data.title}</h2>
      {data.image && <Image src={data.image} alt={data.name || 'Santo'} width={800} height={500} className='rounded-lg w-full h-auto'/>}
      <p>{data.description}</p>
      {data.sourceUrl && <a href={data.sourceUrl} className='underline' target='_blank'>Fuente</a>}
      <p className='text-xs text-slate-500'>Origen: {data.source}</p>
    </article>}
  </div>
}
