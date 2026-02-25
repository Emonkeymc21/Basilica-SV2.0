import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-[#f9f5eb] via-white to-[#eef3fb] p-6 md:p-10 shadow-sm">
      <div className="absolute inset-0 opacity-40 pointer-events-none" aria-hidden>
        <div className="absolute -top-10 right-6 h-40 w-40 rounded-full bg-amber-200 blur-3xl" />
        <div className="absolute bottom-0 left-4 h-44 w-44 rounded-full bg-blue-200 blur-3xl" />
      </div>
      <div className="relative grid gap-6 md:grid-cols-[1.15fr_.85fr] items-center">
        <div>
          <p className="inline-flex items-center rounded-full border border-amber-300 bg-white/80 px-3 py-1 text-xs font-medium text-amber-900">
            Comunidad • Oración • Sacramentos
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-[#0e2a47] leading-tight" style={{fontFamily:'serif'}}>
            Una comunidad viva para encontrarnos con Cristo
          </h1>
          <p className="mt-4 max-w-2xl text-stone-700 md:text-lg">
            Horarios de misa, confesiones, sacramentos, noticias y espacios de formación en una experiencia clara, cálida y accesible para toda la comunidad.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/horarios" className="rounded-xl bg-[#0e2a47] px-4 py-3 text-white font-semibold hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e2a47]">
              Ver horarios de misa
            </Link>
            <Link href="#intenciones" className="rounded-xl border border-[#c9a45c] bg-white px-4 py-3 text-[#0e2a47] font-semibold hover:bg-amber-50">
              Pedir oración
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
          {[
            ['Hoy', 'Misas y celebraciones', '/horarios'],
            ['Sacramentos', 'Requisitos y acompañamiento', '/sacramentos'],
            ['Comunidad', 'Catequesis, grupos y voluntariado', '/nosotros'],
          ].map(([k, v, href]) => (
            <Link key={k} href={href} className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm hover:shadow-md transition">
              <div className="text-xs uppercase tracking-wide text-[#6d1f2b] font-semibold">{k}</div>
              <div className="mt-1 text-sm text-stone-800">{v}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
