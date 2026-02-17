
import fs from 'node:fs/promises';
import path from 'node:path';

export type LiturgicalItem = {
  date: string;
  celebration: string;
  saint?: string;
  rank: string;
  color: string;
  season?: string;
  country?: string;
  diocese?: string;
  source?: string;
  image_url?: string;
};

const TZ = 'America/Argentina/Mendoza';
const OVERRIDES_FILE = path.join(process.cwd(), 'src/data/liturgical_overrides_2026_mendoza.json');
const IMAGES_FILE = path.join(process.cwd(), 'src/data/saint_images.json');

function ymdInTz(date = new Date(), tz = TZ) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export async function loadOverrides(): Promise<LiturgicalItem[]> {
  try {
    const txt = await fs.readFile(OVERRIDES_FILE, 'utf-8');
    const arr = JSON.parse(txt);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function loadSaintImages(): Promise<Record<string,string>> {
  try {
    const txt = await fs.readFile(IMAGES_FILE, 'utf-8');
    const obj = JSON.parse(txt);
    return obj && typeof obj === 'object' ? obj : {};
  } catch {
    return {};
  }
}

export async function getDayData(inputDate?: string) {
  const date = inputDate || ymdInTz(new Date());
  const list = await loadOverrides();
  const images = await loadSaintImages();
  const item = list.find((x) => x.date === date);
  if (!item) {
    return {
      date,
      saint: 'Santo del día',
      celebration: 'Feria',
      rank: 'feria',
      color: 'verde',
      season: '',
      image_url: images['Santo del día'] || '',
      source: 'local-fallback'
    };
  }
  return {
    ...item,
    image_url: item.image_url || (item.saint ? images[item.saint] : '') || '',
    source: item.source || 'overrides-ar-mendoza'
  };
}

export async function getYearCalendar(year: number, country = 'AR', diocese = 'mendoza') {
  const list = await loadOverrides();
  const items = list
    .filter((x) => x.date.startsWith(`${year}-`))
    .filter((x) => !x.country || x.country.toUpperCase() === country.toUpperCase())
    .filter((x) => !x.diocese || x.diocese.toLowerCase() === diocese.toLowerCase())
    .sort((a,b) => a.date.localeCompare(b.date));
  return items;
}
