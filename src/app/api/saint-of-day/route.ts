import {NextResponse} from 'next/server';
import {parseSaintHtml} from '@/lib/saintParser';
import fs from 'node:fs/promises';
const URL='https://www.vaticannews.va/es/santo-del-dia.html';
const CACHE='/tmp/saint_cache.json';
export async function GET(){
 try{
  const r=await fetch(URL,{next:{revalidate:3600}}); const html=await r.text();
  const parsed=parseSaintHtml(html,URL);
  if(parsed){await fs.writeFile(CACHE,JSON.stringify(parsed)); return NextResponse.json({source:'live',...parsed});}
  throw new Error('parse_fail');
 }catch(e){
  try{const c=JSON.parse(await fs.readFile(CACHE,'utf-8')); return NextResponse.json({source:'cache',...c});}catch{}
  return NextResponse.json({source:'manual',name:'San Vicente Ferrer',description:'Contenido manual de respaldo',image:'/images/saint-placeholder.jpg',sourceUrl:URL},{status:200});
 }
}
