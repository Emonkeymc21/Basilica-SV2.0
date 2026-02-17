
import { NextResponse } from 'next/server';
import { getYearCalendar } from '@/lib/liturgical';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get('year') || '');
  const country = (searchParams.get('country') || 'AR').toUpperCase();
  const diocese = (searchParams.get('diocese') || 'mendoza').toLowerCase();

  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return NextResponse.json({ error: 'year inválido' }, { status: 400 });
  }

  const items = await getYearCalendar(year, country, diocese);
  return NextResponse.json({
    year,
    country,
    diocese,
    total: items.length,
    items
  });
}
