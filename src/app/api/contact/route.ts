import crypto from "crypto";
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { sha256 } from '@/lib/security/hash';
import { validateContact } from '@/lib/validators/forms';
import { mockContactMessages } from '@/lib/db/mockStore';
import { logError, logInfo } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = checkRateLimit(`contact:${ip}`, 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = validateContact(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: 'Datos inválidos', details: parsed.errors }, { status: 400 });
    }

    // TODO: validar captcha (reCAPTCHA/hCaptcha) en producción.
    const record = {
      id: crypto.randomUUID(),
      ...parsed.data,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      ipHash: sha256(ip),
      userAgent: req.headers.get('user-agent') || undefined,
    };
    mockContactMessages.push(record);
    logInfo('contact_message.created', { id: record.id, email: record.email });

    return NextResponse.json({ ok: true, message: 'Mensaje recibido. Gracias por comunicarte.' }, { status: 201 });
  } catch (error) {
    logError('contact_message.error', { error: (error as Error).message });
    return NextResponse.json({ error: 'No se pudo procesar el mensaje' }, { status: 500 });
  }
}
