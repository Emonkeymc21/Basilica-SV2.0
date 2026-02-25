const sacraments = [
  ['bautismo', 'Bautismo', 'La puerta de la vida cristiana.'],
  ['eucaristia', 'Eucaristía', 'Alimento espiritual en la presencia real de Cristo.'],
  ['confirmacion', 'Confirmación', 'Fortaleza en el Espíritu Santo.'],
  ['matrimonio', 'Matrimonio', 'Alianza de amor bendecida por Dios.'],
  ['reconciliacion', 'Reconciliación', 'Misericordia y renovación del corazón.'],
  ['uncion', 'Unción de los enfermos', 'Consuelo, fortaleza y gracia en la enfermedad.'],
];

export default function SacramentosPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-stone-200 bg-white p-6">
        <h1 className="text-3xl font-semibold text-[#0e2a47]">Sacramentos</h1>
        <p className="mt-2 text-stone-700">Información general y requisitos. Esta sección queda preparada para conectarse al CMS/panel.</p>
      </header>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sacraments.map(([slug, title, desc]) => (
          <article key={slug} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-[#0e2a47]">{title}</h2>
            <p className="mt-2 text-sm text-stone-700">{desc}</p>
            <a href={`/sacramentos/${slug}`} className="mt-3 inline-block text-sm underline text-[#6d1f2b]">Ver detalle</a>
          </article>
        ))}
      </section>
    </div>
  );
}
