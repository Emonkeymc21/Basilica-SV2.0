
import { NextResponse } from 'next/server';
import { getDayData } from '@/lib/liturgical';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') || undefined;
  const locale = searchParams.get('locale') || 'es-AR';
  const diocese = searchParams.get('diocese') || 'mendoza';

  const data = await getDayData(date);
  return NextResponse.json({
    ...data,
    locale,
    diocese,
    image_included: Boolean(data.image_url)
  });
}
