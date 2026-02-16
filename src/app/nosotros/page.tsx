import history from '@/data/history.json';
export default function Nosotros(){return <div className='space-y-4'><h1 className='text-3xl font-bold'>Nosotros</h1><article className='bg-white border rounded-xl p-4'><h2 className='text-xl font-semibold'>{(history as any).title}</h2><p className='whitespace-pre-line mt-3'>{(history as any).text}</p></article></div>}
