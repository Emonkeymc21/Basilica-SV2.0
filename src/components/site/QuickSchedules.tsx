export function QuickSchedules() {
  const cards = [
    { title: 'Misas', subtitle: 'Lun a sáb · 19:00 | Dom · 9:00, 11:00, 19:30', icon: '✝️' },
    { title: 'Confesiones', subtitle: 'Mié y vie · 18:00 a 19:00', icon: '🕊️' },
    { title: 'Adoración', subtitle: 'Jue · 17:00 a 19:00', icon: '🕯️' },
  ];
  return (
    <section aria-labelledby="horarios-rapidos" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id="horarios-rapidos" className="text-2xl font-semibold text-[#0e2a47]">Horarios destacados</h2>
        <a href="/horarios" className="text-sm text-[#0e2a47] underline">Ver todos</a>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <article key={c.title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="text-xl" aria-hidden>{c.icon}</div>
            <h3 className="mt-2 font-semibold text-stone-900">{c.title}</h3>
            <p className="mt-1 text-sm text-stone-600">{c.subtitle}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
