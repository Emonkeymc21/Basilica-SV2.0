import Link from 'next/link'
const items=[['/','Inicio'],['/nosotros','Nosotros'],['/cancionero','Cancionero'],['/santo-de-hoy','Santo de Hoy'],['/calendarios','Calendarios'],['/oraciones-santos','Oraciones y Santos'],['/horarios','Horarios de Misa']]
export default function Navbar(){return <nav className='sticky top-0 z-50 bg-white/95 border-b'><div className='max-w-6xl mx-auto px-4 py-3 flex gap-3 flex-wrap'>{items.map(([href,label])=><Link key={href} href={href} className='px-3 py-2 rounded-lg hover:bg-amber-50 text-sm md:text-base'>{label}</Link>)}</div></nav>}
