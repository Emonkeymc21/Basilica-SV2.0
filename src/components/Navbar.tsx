import Link from 'next/link';
import Image from 'next/image';

const items = [
  ['/', 'Inicio'],
  ['/horarios', 'Horarios'],
  ['/sacramentos', 'Sacramentos'],
  ['/calendarios', 'Calendario'],
  ['/contacto', 'Contacto'],
  ['/admin', 'Panel'],
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e7dcc0] bg-white/90 backdrop-blur">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 rounded bg-white px-3 py-2 border">Saltar al contenido</a>
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3" aria-label="Principal">
        <Link href="/" className="mr-2 flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-stone-50">
          <Image src="/images/logo.png" alt="Logo de la Basílica" width={44} height={44} className="rounded-full border border-amber-300 bg-white" />
          <div className="leading-tight">
            <p className="font-semibold text-[#0e2a47]">Basílica San Vicente Ferrer</p>
            <p className="text-xs text-stone-600">Godoy Cruz · Mendoza</p>
          </div>
        </Link>
        <div className="flex flex-wrap gap-1">
          {items.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm text-stone-800 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e2a47]">
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
