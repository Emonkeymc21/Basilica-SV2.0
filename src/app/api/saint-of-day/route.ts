import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

const LITCAL_URL = 'https://litcal.johnromanodorazio.com/api/v5/calendar';
const CACHE = '/tmp/saint_cache.json';
const FALLBACK_FILE = path.join(process.cwd(), 'src/data/saints.json');
const TZ = 'America/Argentina/Mendoza';

function ymdInTz(date = new Date(), tz = TZ) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function parseLitcalDate(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') {
    const m = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return null;
  }
  if (typeof value === 'number') {
    const d = new Date(value * 1000);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  if (typeof value === 'object' && value !== null) {
    const maybe = value as Record<string, unknown>;
    if (typeof maybe.date === 'string') return parseLitcalDate(maybe.date);
  }
  return null;
}

function fallbackFromLocal() {
  return fs.readFile(FALLBACK_FILE, 'utf-8')
    .then((txt) => JSON.parse(txt))
    .then((raw) => {
      const s = raw?.[0] || {};
      return {
        title: s.name || 'Santo del día',
        description: s.description || 'Sin descripción disponible.',
        image: s.image || '',
        sourceUrl: s.sourceUrl || '',
        source: 'fallback',
      };
    })
    .catch(() => ({
      title: 'Santo del día',
      description: 'Sin descripción disponible.',
      image: '',
      sourceUrl: '',
      source: 'fallback',
    }));
}

export async function GET() {
  const today = ymdInTz();
  const year = Number(today.slice(0, 4));

  try {
    const url = `${LITCAL_URL}?year=${year}&locale=es`;
    const res = await fetch(url, { next: { revalidate: 21600 } });
    if (!res.ok) throw new Error(`litcal ${res.status}`);
    const data = await res.json();

    // LitCal usually returns an array of celebrations under one of these keys
    const bucket = Array.isArray(data)
      ? data
      : Array.isArray(data?.litcal)
      ? data.litcal
      : Array.isArray(data?.events)
      ? data.events
      : Array.isArray(data?.celebrations)
      ? data.celebrations
      : [];

    const todayItems = bucket.filter((item: any) => {
      const d = parseLitcalDate(item?.date ?? item?.start ?? item?.eventDate);
      return d === today;
    });

    const main = todayItems[0];
    if (!main) throw new Error('no-celebration-for-today');

    const payload = {
      date: today,
      title: main?.name || main?.title || 'Celebración del día',
      description:
        main?.common ||
        main?.description ||
        main?.grade_lcl ||
        main?.grade ||
        'Celebración litúrgica del día.',
      liturgicalColor: Array.isArray(main?.color)
        ? main.color.join(', ')
        : main?.color || '',
      grade: main?.grade_lcl || main?.grade || '',
      season: main?.season || '',
      readings: main?.readings || null,
      allToday: todayItems.map((x: any) => ({
        title: x?.name || x?.title || 'Celebración',
        color: Array.isArray(x?.color) ? x.color.join(', ') : x?.color || '',
        grade: x?.grade_lcl || x?.grade || '',
      })),
      source: 'litcal',
      sourceUrl: 'https://litcal.johnromanodorazio.com',
    };

    await fs.writeFile(CACHE, JSON.stringify(payload));
    return NextResponse.json(payload);
  } catch {
    try {
      const cache = JSON.parse(await fs.readFile(CACHE, 'utf-8'));
      return NextResponse.json({ ...cache, source: 'cache' });
    } catch {
      const fallback = await fallbackFromLocal();
      return NextResponse.json(fallback);
    }
  }
}
