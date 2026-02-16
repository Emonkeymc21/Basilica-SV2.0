const SPECIAL_MAP:Record<string,string>={
  'jueves santo':'jueves-santo',
  'viernes santo':'viernes-santo',
  'sabado de gloria':'sabado-gloria',
  'domingo de pascua':'domingo-pascua',
  'navidad':'navidad'
}
export function guessSongbookByDate(date=new Date()){
  const day=date.getDay(); const hour=date.getHours();
  const md=`${date.getMonth()+1}-${date.getDate()}`
  if(md==='12-25') return 'navidad';
  if(day===0 && hour>=9 && hour<=13) return 'domingo-11';
  if(day===0 && hour>=18 && hour<=22) return 'domingo-20';
  return 'manual';
}
export function slugFromCelebration(c:string){
 return c.toLowerCase() .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u').replace(/\s+/g,'-')
}
