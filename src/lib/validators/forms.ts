import { sanitizeMultiline, sanitizeText } from '@/lib/security/sanitize';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactInput = {
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export type PrayerRequestInput = {
  fullName?: string;
  email?: string;
  intention: string;
  isAnonymous?: boolean;
  allowContact?: boolean;
};

export function validateContact(payload: any): { ok: true; data: ContactInput } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const fullName = sanitizeText(String(payload?.fullName ?? ''));
  const email = sanitizeText(String(payload?.email ?? ''));
  const phone = sanitizeText(String(payload?.phone ?? ''));
  const subject = sanitizeText(String(payload?.subject ?? ''));
  const message = sanitizeMultiline(String(payload?.message ?? ''));

  if (fullName.length < 2) errors.push('Nombre inválido');
  if (!emailRegex.test(email)) errors.push('Email inválido');
  if (message.length < 10) errors.push('Mensaje demasiado corto');
  if (message.length > 5000) errors.push('Mensaje demasiado largo');

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { fullName, email, phone: phone || undefined, subject: subject || undefined, message } };
}

export function validatePrayerRequest(payload: any): { ok: true; data: PrayerRequestInput } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const fullName = sanitizeText(String(payload?.fullName ?? ''));
  const email = sanitizeText(String(payload?.email ?? ''));
  const intention = sanitizeMultiline(String(payload?.intention ?? ''));
  const isAnonymous = Boolean(payload?.isAnonymous);
  const allowContact = Boolean(payload?.allowContact);

  if (intention.length < 8) errors.push('La intención es demasiado corta');
  if (intention.length > 3000) errors.push('La intención es demasiado larga');
  if (email && !emailRegex.test(email)) errors.push('Email inválido');

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { fullName: fullName || undefined, email: email || undefined, intention, isAnonymous, allowContact } };
}
