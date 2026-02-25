import './globals.css';
import Navbar from '@/components/Navbar';
import { churchSchema } from '@/lib/seo/schema';

export const metadata = {
  title: {
    default: 'Basílica San Vicente Ferrer',
    template: '%s | Basílica San Vicente Ferrer',
  },
  description: 'Sitio institucional y pastoral: horarios de misa, sacramentos, noticias y contacto.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ejemplo-parroquia.org'),
  openGraph: {
    type: 'website',
    title: 'Basílica San Vicente Ferrer',
    description: 'Horarios de misa, sacramentos, noticias y vida parroquial.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = churchSchema();
  return (
    <html lang="es">
      <body className="bg-[#faf7f0] text-stone-900 antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <Navbar />
        <main id="main-content" className="mx-auto max-w-6xl px-4 py-6 md:py-8">{children}</main>
      </body>
    </html>
  );
}
