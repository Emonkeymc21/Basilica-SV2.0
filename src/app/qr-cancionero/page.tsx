'use client'
import { useMemo } from 'react';

function target(){
 const now=new Date(); const d=now.getDay(); const h=now.getHours();
 if(d===0 && h>=9 && h<14) return '/cancionero?cele=domingo-11';
 if(d===0 && h>=18 && h<23) return '/cancionero?cele=domingo-20';
 return '/cancionero';
}

export default function QrPage(){
 const t=useMemo(()=>target(),[]);
 const url= typeof window!=='undefined' ? `${window.location.origin}${t}` : t;
 const qr=`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(url)}`;
 return <div className='space-y-4'><h1 className='text-3xl font-bold'>QR Cancionero</h1><p>Destino sugerido: <b>{t}</b></p><img src={qr} alt='QR cancionero' className='border rounded'/><a href={t} className='underline'>Abrir destino</a></div>
}
