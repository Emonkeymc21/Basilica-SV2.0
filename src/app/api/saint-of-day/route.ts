import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

const CACHE = '/tmp/saint_cache.json';
const FALLBACK_FILE = path.join(process.cwd(), 'src/data/saints.json');
const TZ = 'America/Argentina/Mendoza';

// Página base de MyCatholic.life (saints calendar)
const MYCATHOLIC_URL = 'https://mycatholic.life/saints/saints-of-the-liturgical-year/';

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

function monthDayInTzEs(date = new Date(), tz = TZ) {
  const parts = new Intl.DateTimeFormat('es-AR', {
    timeZone: tz,
    month: 'long',
    day: 'numeric',
  }).formatToParts(date);

  const day = parts.find((p) => p.type === 'day')?.value || '';
  let month = parts.find((p) => p.type === 'month')?.value || '';
  month = month.toLowerCase();
  return { day, month }; // ej: { day: "16", month: "febrero" }
}

function stripHtml(s: string) {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeBasicEntities(s: string) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function pickMeta(html: string, names: string[]) {
  for (const n of names) {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${n}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      'i'
    );
    const m = html.match(re);
    if (m?.[1]) return decodeBasicEntities(m[1].trim());
  }
  return '';
}

function pickJsonLd(html: string) {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const b of blocks) {
    const raw = b[1]?.trim();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of arr) {
        const type = item?.['@type'];
        const headline = item?.headline || item?.name || '';
        const description = item?.description || '';
        const image =
          typeof item?.image === 'string'
            ? item.image
            : Array.isArray(item?.image) && item.image[0]
            ? item.image[0]
            : item?.image?.url || '';
        if (type && (headline || description)) {
          return {
            title: decodeBasicEntities(String(headline || '')).trim(),
            description: decodeBasicEntities(String(description || '')).trim(),
            image: String(image || '').trim(),
          };
        }
      }
    } catch {
      // ignore malformed blocks
    }
  }
  return null;
}

function fallbackFromLocal() {
  return fs.readFile(FALLBACK_FILE, 'utf-8')
    .then((txt) => JSON.parse(txt))
    .then((raw) => {
      const s = raw?.[0] || {};
      return {
        date: ymdInTz(),
        title: s.name || 'Santo del día',
        description: s.description || 'Sin descripción disponible.',
        image: s.image || '',
        sourceUrl: s.sourceUrl || '',
        source: 'fallback',
      };
    })
    .catch(() => ({
      date: ymdInTz(),
      title: 'Santo del día',
      description: 'Sin descripción disponible.',
      image: '',
      sourceUrl: '',
      source: 'fallback',
    }));
}

/**
 * Parser heurístico:
 * 1) intenta JSON-LD/OG de la página
 * 2) intenta encontrar un bloque por fecha "16 febrero" / "16 de febrero"
 * 3) fallback local
 */
async function fetchFromMyCatholic() {
  const today = ymdInTz();
  const { day, month } = monthDayInTzEs();

  const res = await fetch(MYCATHOLIC_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; BasilicaSV/1.0; +https://example.org)',
      Accept: 'text/html,application/xhtml+xml',
    },
    // cache 6h
    next: { revalidate: 21600 },
  });

  if (!res.ok) throw new Error(`mycatholic ${res.status}`);
  const htmlRaw = await res.text();
  const html = decodeBasicEntities(htmlRaw);

  // 1) JSON-LD / meta
  const jsonLd = pickJsonLd(html);
  const ogTitle = pickMeta(html, ['og:title', 'twitter:title']);
  const ogDesc = pickMeta(html, ['og:description', 'description', 'twitter:description']);
  const ogImg = pickMeta(html, ['og:image', 'twitter:image']);

  // 2) Búsqueda por fecha dentro del contenido
  const plain = stripHtml(html).toLowerCase();
  const dateNeedle1 = `${day} ${month}`.toLowerCase();
  const dateNeedle2 = `${day} de ${month}`.toLowerCase();

  let extractedTitle = '';
  let extractedDesc = '';

  // heurística simple: si encuentra "16 de febrero", toma un fragmento de contexto
  let idx = plain.indexOf(dateNeedle1);
  if (idx < 0) idx = plain.indexOf(dateNeedle2);

  if (idx >= 0) {
    const start = Math.max(0, idx - 120);
    const end = Math.min(plain.length, idx + 520);
    const snippet = plain.slice(start, end).replace(/\s+/g, ' ').trim();

    // título aproximado: texto desde fecha hasta primer punto o guion largo
    const mTitle = snippet.match(new RegExp(`(?:${day}\\s*(?:de\\s*)?${month})\\s*[:\\-–]?\\s*([^\\.\\|\\-–]{10,120})`, 'i'));
    if (mTitle?.[1]) extractedTitle = mTitle[1].trim();

    // descripción aproximada
    extractedDesc = snippet;
  }

  const title =
    extractedTitle ||
    jsonLd?.title ||
    ogTitle ||
    'Santo del día';

  const description =
    extractedDesc ||
    jsonLd?.description ||
    ogDesc ||
    'Reflexión y vida del santo del día.';

  const payload = {
    date: today,
    title,
    description,
    image: jsonLd?.image || ogImg || '',
    source: 'mycatholic',
    sourceUrl: MYCATHOLIC_URL,
  };

  return payload;
}

export async function GET() {
  try {
    const payload = await fetchFromMyCatholic();
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
