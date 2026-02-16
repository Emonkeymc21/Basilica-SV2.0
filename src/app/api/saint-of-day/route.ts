import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

const URL='https://www.vaticannews.va/es/santos.html';
const CACHE='/tmp/saint_cache.json';
const FALLBACK_FILE=path.join(process.cwd(),'src/data/saints.json');

const clean=(t='')=>t.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const abs=(u:string)=>u.startsWith('http')?u:`https://www.vaticannews.va${u.startsWith('/')?'':'/'}${u}`;

async function fallback(){
  try{
    const raw=JSON.parse(await fs.readFile(FALLBACK_FILE,'utf-8'));
    const s=raw?.[0]||{};
    return {name:s.name||'Santo del día',description:s.description||'Sin descripción disponible.',image:s.image||'',sourceUrl:s.sourceUrl||URL};
  }catch{
    return {name:'Santo del día',description:'Sin descripción disponible.',image:'',sourceUrl:URL};
  }
}

export async function GET(){
  try{
    const r=await fetch(URL,{headers:{'user-agent':'Mozilla/5.0'},next:{revalidate:21600}});
    const html=await r.text();

    // intenta detectar primer card de santo
    const card = html.match(/<article[\s\S]*?<\/article>/i)?.[0] || html;
    const title = clean((card.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i)?.[1])||'Santo del día');
    const desc = clean((card.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1])||'');
    const img = (card.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1])||'';
    const href = (card.match(/<a[^>]+href=["']([^"']+)["']/i)?.[1])||URL;

    const live={
      name:title||'Santo del día',
      description:desc||'Sin descripción disponible.',
      image:img?abs(img):'',
      sourceUrl:href.startsWith('http')?href:abs(href)
    };
    const safe={...(await fallback()), ...live};
    await fs.writeFile(CACHE,JSON.stringify(safe));
    return NextResponse.json({source:'vaticannews',...safe});
  } catch {
    try{
      const c=JSON.parse(await fs.readFile(CACHE,'utf-8'));
      return NextResponse.json({source:'cache',...c});
    }catch{}
    return NextResponse.json({source:'fallback',...(await fallback())});
  }
}
