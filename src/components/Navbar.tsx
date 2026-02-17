import Link from 'next/link'
import Image from 'next/image'
const items=[['/','Inicio'],['/nosotros','Nosotros'],['/cancionero','Cancionero'],['/santo-de-hoy','Santo de Hoy'],['/calendarios','Calendario'],['/oraciones-santos','Oraciones y Santos'],['/horarios','Informes']]
export default function Navbar(){
  return <nav className='sticky top-0 z-50 bg-white/95 border-b border-amber-200 backdrop-blur'>
    <div className='max-w-6xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap'>
      <Link href='/' className='flex items-center gap-3 mr-2'>
        <Image src='/images/logo.png' alt='Logo Basílica San Vicente Ferrer' width={44} height={44} className='rounded-full border border-amber-300'/>
        <div className='leading-tight'>
          <p className='font-semibold text-amber-900'>Basílica San Vicente Ferrer</p>
          <p className='text-xs text-stone-600'>Godoy Cruz, Mendoza</p>
        </div>
      </Link>
      <div className='flex gap-2 flex-wrap'>
      {items.map(([href,label])=><Link key={href} href={href} className='px-3 py-2 rounded-lg hover:bg-amber-50 text-sm md:text-base text-stone-800'>{label}</Link>)}
      </div>
    </div>
  </nav>
}
