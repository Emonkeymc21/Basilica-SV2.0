import announcements from '@/data/announcements.json';
import events from '@/data/events.json';
import Link from 'next/link';
import { Hero } from '@/components/site/Hero';
import { QuickSchedules } from '@/components/site/QuickSchedules';
import { PrayerRequestForm } from '@/components/site/PrayerRequestForm';

export default function Home() {
  const today = new Date().toISOString().slice(0, 10);
  const todayEvents = (events as any[]).filter((e: any) => e.start?.slice(0, 10) === today).slice(0, 5);
  const featuredNews = (announcements as any[]).slice(0, 4);

  return (
    <div className="space-y-8 md:space-y-10">
      <Hero />
      <QuickSchedules />

      <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#0e2a47]">Novedades parroquiales</h2>
            <Link href="/noticias" className="text-sm underline">Ver todas</Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {featuredNews.map((a: any) => (
              <article key={a.id} className="rounded-xl border border-stone-200 p-4 hover:shadow-sm transition">
                <h3 className="font-semibold text-stone-900">{a.title}</h3>
                <p className="mt-1 text-sm text-stone-700">{a.summary}</p>
                {a.when && <p className="mt-2 text-xs text-stone-500">{a.when}</p>}
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-[#0e2a47]">Actividades de hoy</h2>
            <div className="mt-3">
              {todayEvents.length ? (
                <ul className="space-y-2">
                  {todayEvents.map((e: any) => (
                    <li key={e.id} className="rounded-xl border border-stone-200 p-3">
                      <p className="font-medium">{e.title}</p>
                      <p className="text-sm text-stone-600">
                        {new Date(e.start).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} · {e.location}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-stone-600">No hay actividades cargadas para hoy.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[#d9c9a2] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-[#0e2a47]">Sacramentos</h2>
            <p className="mt-2 text-sm text-stone-700">Conocé requisitos, preparación e información de cada sacramento.</p>
            <Link href="/sacramentos" className="mt-3 inline-flex rounded-xl border border-[#c9a45c] px-3 py-2 text-sm font-medium text-[#0e2a47] hover:bg-amber-50">Ver sacramentos</Link>
          </section>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#0e2a47]">Bienvenidos a la comunidad</h2>
        <p className="mt-3 max-w-3xl text-stone-700">
          Queremos ser una casa abierta para todos: familias, jóvenes, adultos mayores y quienes desean acercarse por primera vez.
          Encontrá aquí un espacio de oración, formación y encuentro con la vida parroquial.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/nosotros" className="rounded-xl bg-[#0e2a47] px-4 py-2.5 text-white">Nuestra historia</Link>
          <Link href="/contacto" className="rounded-xl border border-stone-300 px-4 py-2.5">Contacto y ubicación</Link>
        </div>
      </section>

      <PrayerRequestForm />
    </div>
  );
}
