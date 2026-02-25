export function AdminDashboardShell() {
  const cards = [
    ['Mensajes nuevos', '12'],
    ['Intenciones pendientes', '8'],
    ['Eventos próximos', '5'],
    ['Publicaciones en borrador', '6'],
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl border border-stone-200 bg-white p-4 h-fit">
        <h2 className="font-semibold text-[#0e2a47]">Panel administrativo</h2>
        <nav className="mt-3 grid gap-1 text-sm">
          {['Dashboard','Horarios','Eventos','Noticias','Páginas','Intenciones','Mensajes','Medios','Usuarios','Configuración'].map((item)=> (
            <a key={item} href="#" className="rounded-lg px-3 py-2 hover:bg-stone-100">{item}</a>
          ))}
        </nav>
      </aside>
      <section className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-stone-600">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#0e2a47]">{value}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <h3 className="font-semibold">Acciones rápidas</h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              <li>+ Crear evento</li>
              <li>+ Actualizar horarios de misa</li>
              <li>+ Publicar noticia</li>
              <li>+ Moderar intenciones de oración</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <h3 className="font-semibold">Permisos por rol</h3>
            <div className="mt-3 grid gap-2 text-sm">
              <p><b>Admin</b>: todo el sistema, usuarios, configuración.</p>
              <p><b>Editor</b>: contenidos, horarios, eventos, medios, publicación.</p>
              <p><b>Colaborador</b>: borradores y formularios, sin publicar.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
