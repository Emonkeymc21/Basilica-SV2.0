export function churchSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: 'Basílica San Vicente Ferrer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Godoy Cruz',
      addressRegion: 'Mendoza',
      addressCountry: 'AR',
    },
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ejemplo-parroquia.org',
  };
}
