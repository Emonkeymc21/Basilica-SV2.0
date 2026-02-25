import crypto from "crypto";
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { sha256 } from '@/lib/security/hash';
import { validatePrayerRequest } from '@/lib/validators/forms';
import { mockPrayerRequests } from '@/lib/db/mockStore';
import { logError, logInfo } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = checkRateLimit(`prayer:${ip}`, 3, 60_000);
    if (!rl.ok) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta más tarde.' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = validatePrayerRequest(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: 'Datos inválidos', details: parsed.errors }, { status: 400 });
    }

    const record = {
      id: crypto.randomUUID(),
      ...parsed.data,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      ipHash: sha256(ip),
      userAgent: req.headers.get('user-agent') || undefined,
    };
    mockPrayerRequests.push(record);
    logInfo('prayer_request.created', { id: record.id, anonymous: record.isAnonymous });

    return NextResponse.json({ ok: true, message: 'Tu intención fue recibida con respeto y confidencialidad.' }, { status: 201 });
  } catch (error) {
    logError('prayer_request.error', { error: (error as Error).message });
    return NextResponse.json({ error: 'No se pudo registrar la intención de oración' }, { status: 500 });
  }
}
