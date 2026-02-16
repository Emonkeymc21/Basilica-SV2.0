import {JSDOM} from 'jsdom';
export type ParsedSaint={name:string;description:string;image:string;sourceUrl:string}
export function parseSaintHtml(html:string,sourceUrl:string):ParsedSaint|null{
  try{
    const dom=new JSDOM(html); const d=dom.window.document;
    const name=d.querySelector('h1, h2')?.textContent?.trim();
    const description=d.querySelector('p')?.textContent?.trim();
    const image=(d.querySelector('img') as HTMLImageElement|null)?.src||'';
    if(!name||!description) return null;
    return {name,description,image,sourceUrl};
  }catch{return null}
}
