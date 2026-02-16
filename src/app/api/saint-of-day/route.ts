import {NextResponse} from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
const URL='https://www.vaticannews.va/es/santo-del-dia.html';
const CACHE='/tmp/saint_cache.json';
const FALLBACK_FILE=path.join(process.cwd(),'src/data/saints.json');

function sanitize(t:string){return (t||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();}

async function fallback(){
  try{const raw=JSON.parse(await fs.readFile(FALLBACK_FILE,'utf-8'));const first=raw?.[0];return {name:first?.name||'Santo del día',description:first?.description||'Sin descripción',image:first?.image||'/images/saint-placeholder.jpg',sourceUrl:first?.sourceUrl||URL};}
  catch{return {name:'Santo del día',description:'Contenido de respaldo',image:'/images/saint-placeholder.jpg',sourceUrl:URL};}
}

export async function GET(){
 try{
  const r=await fetch(URL,{next:{revalidate:21600},headers:{'user-agent':'Mozilla/5.0'}});
  const html=await r.text();
  const mTitle=html.match(/<h2[^>]*>(.*?)<\/h2>/i) || html.match(/santo del dia[^<]*<[^>]*>([^<]+)/i);
  const mDesc=html.match(/<p[^>]*>(.*?)<\/p>/i);
  const mImg=html.match(/<img[^>]+src=["']([^"']+)["']/i);
  const payload={name:sanitize(mTitle?.[1]||'Santo del día'),description:sanitize(mDesc?.[1]||''),image:mImg?.[1]?.startsWith('http')?mImg[1]:undefined,sourceUrl:URL};
  const safe={...payload, ...(await fallback())};
  await fs.writeFile(CACHE,JSON.stringify(safe));
  return NextResponse.json({source:'live',...safe});
 }catch{
  try{const c=JSON.parse(await fs.readFile(CACHE,'utf-8')); return NextResponse.json({source:'cache',...c});}catch{}
  return NextResponse.json({source:'fallback',...(await fallback())});
 }
}
