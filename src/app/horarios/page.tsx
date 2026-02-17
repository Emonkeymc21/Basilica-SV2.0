import schedule from '@/data/schedule.json';

export default function Informes(){
  const data:any = schedule as any;
  const seasons = data.seasons || [];
  return <div className='space-y-4'>
    <h1 className='text-3xl font-bold'>Informes</h1>
    <p className='text-sm text-slate-500'>Actualizado al: {new Date().toLocaleDateString('es-AR')}</p>
    <article className='bg-white border rounded-xl p-4 space-y-6'>
      <p>{data.address}</p>
      {seasons.map((season:any)=><section key={season.key} className='space-y-3'>
        <h2 className='text-xl font-semibold'>{season.title}</h2>
        {season.sections.map((s:any)=><div key={s.title}><h3 className='font-semibold'>{s.title}</h3><ul className='list-disc pl-5'>{s.items.map((it:any,i:number)=><li key={i}>{it.label}: {it.value}</li>)}</ul></div>)}
      </section>)}
    </article>
  </div>
}
