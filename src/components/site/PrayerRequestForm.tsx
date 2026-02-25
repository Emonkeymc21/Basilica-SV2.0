'use client';
import { FormEvent, useState } from 'react';

export function PrayerRequestForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setMessage(null); setError(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.isAnonymous = form.get('isAnonymous') === 'on';
    payload.allowContact = form.get('allowContact') === 'on';

    const res = await fetch('/api/prayer-requests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || 'No se pudo enviar');
    else {
      setMessage(data.message || 'Intención recibida');
      (e.currentTarget as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <section id="intenciones" aria-labelledby="intenciones-title" className="rounded-2xl border border-[#d9c9a2] bg-[#fbfaf6] p-5 md:p-6">
      <h2 id="intenciones-title" className="text-2xl font-semibold text-[#0e2a47]">Intenciones de oración</h2>
      <p className="mt-2 text-sm text-stone-700">Compartí tu intención. Será recibida con respeto y confidencialidad.</p>
      <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">Nombre
          <input name="fullName" className="rounded-xl border border-stone-300 px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">Email (opcional)
          <input name="email" type="email" className="rounded-xl border border-stone-300 px-3 py-2" />
        </label>
        <label className="md:col-span-2 grid gap-1 text-sm">Intención *
          <textarea name="intention" required minLength={8} rows={4} className="rounded-xl border border-stone-300 px-3 py-2" />
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isAnonymous" /> Publicar/gestionar como anónima</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="allowContact" /> Acepto ser contactado</label>
        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button disabled={loading} className="rounded-xl bg-[#6d1f2b] px-4 py-2.5 text-white font-medium disabled:opacity-50">
            {loading ? 'Enviando...' : 'Enviar intención'}
          </button>
          {message && <p role="status" className="text-sm text-green-700">{message}</p>}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        </div>
      </form>
    </section>
  );
}
