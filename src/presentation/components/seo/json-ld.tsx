import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://sportdataangola.com';

export function OrganizationLD() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: 'Sport Data Angola',
    alternateName: 'SDA',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.svg`,
    description: 'Plataforma angolana de gestão desportiva — federações, atletas, clubes, competições e rankings nacionais.',
    foundingDate: '2025',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AO',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'Angola',
    },
    sameAs: [
      'https://facebook.com/sportdataangola',
      'https://instagram.com/sportdataangola',
      'https://twitter.com/sportdataangola',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function WebSiteLD() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sport Data Angola',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/busca?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function BreadcrumbLD({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
