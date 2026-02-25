'use client';
import { FormEvent, useState } from 'react';

export default function ContactoPage() {
  const [status, setStatus] = useState<string>('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('Enviando...');
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    setStatus(res.ok ? data.message : data.error || 'Error');
    if (res.ok) (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-[#0e2a47]">Contacto</h1>
      <p className="text-stone-700">¿Necesitás orientación, horarios o información de sacramentos? Escribinos.</p>
      <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 md:grid-cols-2">
        <label className="grid gap-1 text-sm">Nombre y apellido<input name="fullName" required className="rounded-xl border border-stone-300 px-3 py-2"/></label>
        <label className="grid gap-1 text-sm">Email<input type="email" name="email" required className="rounded-xl border border-stone-300 px-3 py-2"/></label>
        <label className="grid gap-1 text-sm">Teléfono<input name="phone" className="rounded-xl border border-stone-300 px-3 py-2"/></label>
        <label className="grid gap-1 text-sm">Asunto<input name="subject" className="rounded-xl border border-stone-300 px-3 py-2"/></label>
        <label className="md:col-span-2 grid gap-1 text-sm">Mensaje<textarea name="message" required minLength={10} rows={5} className="rounded-xl border border-stone-300 px-3 py-2"/></label>
        <div className="md:col-span-2 flex items-center gap-3">
          <button className="rounded-xl bg-[#0e2a47] px-4 py-2.5 text-white">Enviar</button>
          <span className="text-sm text-stone-600">{status}</span>
        </div>
      </form>
    </div>
  );
}
