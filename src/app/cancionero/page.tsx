'use client'
import songs from '@/data/songs.json';
import {useMemo,useState} from 'react';
export default function CancioneroPage(){
 const [q,setQ]=useState(''); const [cele,setCele]=useState('all'); const [season,setSeason]=useState('all'); const [chords,setChords]=useState(false);
 const filtered=useMemo(()=>songs.filter(s=>(!q||String(s.number).includes(q.replace(/\D/g,'')))&&(cele==='all'||s.celebration===cele)&&(season==='all'||s.season===season)),[q,cele,season]);
 return <div className='space-y-4'>
  <h1 className='text-3xl font-bold'>Cancionero</h1>
  <div className='grid md:grid-cols-4 gap-3'>
   <input aria-label='Buscar por numero' value={q} onChange={e=>setQ(e.target.value)} placeholder='nro 127' className='p-3 rounded border'/>
   <select value={cele} onChange={e=>setCele(e.target.value)} className='p-3 rounded border'><option value='all'>Celebración</option>{[...new Set(songs.map(s=>s.celebration))].map(v=><option key={v}>{v}</option>)}</select>
   <select value={season} onChange={e=>setSeason(e.target.value)} className='p-3 rounded border'><option value='all'>Tiempo litúrgico</option>{[...new Set(songs.map(s=>s.season))].map(v=><option key={v}>{v}</option>)}</select>
   <button onClick={()=>setChords(v=>!v)} className='p-3 rounded bg-stone-800 text-white'>{chords?'Ocultar':'Mostrar'} acordes</button>
  </div>
  {filtered.map(s=><article key={s.id} className='bg-white p-4 rounded-xl border text-lg leading-relaxed'><h3 className='font-semibold'>{s.number} · {s.title}</h3>{chords&&<pre>{s.chords}</pre>}<p>{s.lyrics}</p></article>)}
 </div>
}
