import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

const CACHE = '/tmp/saint_cache.json';
const FALLBACK_FILE = path.join(process.cwd(), 'src/data/saints.json');
const TZ = 'America/Argentina/Mendoza';

// Fuente tipo feed/sitio (no API REST oficial estable)
const MYCATHOLIC_URL = 'https://mycatholic.life/saints/saints-of-the-liturgical-year/';

function ymdInTz(date = new Date(), tz = TZ) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = +date - +start;
  return Math.floor(diff / 86400000);
}

function stripHtml(s: string) {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function localPool() {
  try {
    const txt = await fs.readFile(FALLBACK_FILE, 'utf-8');
    const arr = JSON.parse(txt);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function pickImageFromHtml(html: string) {
  const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return m?.[1] || '';
}

async function fetchMyCatholicHeuristic() {
  const res = await fetch(MYCATHOLIC_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; BasilicaSV/1.0)',
      'Accept': 'text/html,application/xhtml+xml'
    },
    next: { revalidate: 21600 } // 6h
  });
  if (!res.ok) throw new Error(`mycatholic status ${res.status}`);
  const html = await res.text();
  const plain = stripHtml(html);

  const title =
    (plain.match(/Saints?\s+of\s+the\s+Liturgical\s+Year/i)?.[0] ? 'Saint of the Day' : 'Saint of the Day');

  return {
    title,
    description: 'Daily saint and reflection from the liturgical calendar.',
    image: pickImageFromHtml(html),
    source: 'mycatholic',
    sourceUrl: MYCATHOLIC_URL,
    apiLanguage: 'en'
  };
}

export async function GET() {
  const today = new Date();
  const date = ymdInTz(today);

  // selección diaria local garantizada (cambia cada día sí o sí)
  const pool = await localPool();
  const idx = pool.length ? dayOfYear(today) % pool.length : -1;
  const local = idx >= 0 ? pool[idx] : null;

  try {
    const remote = await fetchMyCatholicHeuristic();
    const payload = {
      date,
      title: local?.name || remote.title || 'Santo del día',
      description: local?.description || remote.description || 'Sin descripción disponible.',
      image: local?.image || remote.image || '/images/basilica-hero.jpg',
      source: remote.source,
      sourceUrl: remote.sourceUrl,
      apiLanguage: remote.apiLanguage, // en
      displayLanguage: 'es'
    };
    await fs.writeFile(CACHE, JSON.stringify(payload), 'utf-8');
    return NextResponse.json(payload);
  } catch {
    // cache -> local
    try {
      const cache = JSON.parse(await fs.readFile(CACHE, 'utf-8'));
      return NextResponse.json({ ...cache, source: 'cache' });
    } catch {
      const payload = {
        date,
        title: local?.name || 'Santo del día',
        description: local?.description || 'Sin descripción disponible.',
        image: local?.image || '/images/basilica-hero.jpg',
        source: 'local',
        sourceUrl: '',
        apiLanguage: 'es',
        displayLanguage: 'es'
      };
      return NextResponse.json(payload);
    }
  }
}
