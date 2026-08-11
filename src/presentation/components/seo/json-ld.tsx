import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://sportdataangola.com';

export function OrganizationLD() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Sport Data Angola',
    alternateName: ['SDA', 'Sport Data'],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/favicon.svg`,
      width: '512',
      height: '512',
    },
    image: `${BASE_URL}/og-image.jpg`,
    description:
      'Plataforma angolana de gestão desportiva — federações, atletas, clubes, competições e rankings nacionais.',
    foundingDate: '2025',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AO',
        addressLocality: 'Luanda',
        addressRegion: 'Luanda',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'Angola',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'suporte@sportdataangola.com',
      availableLanguage: ['Portuguese'],
    },
    sameAs: [
      'https://facebook.com/sportdataangola',
      'https://instagram.com/sportdataangola',
      'https://twitter.com/sportdataangola',
    ],
    knowsAbout: [
      'Gestão Desportiva',
      'Federações Desportivas',
      'Competições Desportivas',
      'Rankings Desportivos',
    ],
    keywords:
      'desporto angola, federações angola, atletas angola, gestão desportiva, licença desportiva angola',
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
    '@id': `${BASE_URL}/#website`,
    name: 'Sport Data Angola',
    url: BASE_URL,
    description:
      'Plataforma angolana de gestão desportiva — federações, atletas, clubes, competições e rankings nacionais.',
    inLanguage: 'pt-AO',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
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

export function SportsEventLD(props: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
  url: string;
  organizerName?: string;
  sport?: string;
  status?: 'Scheduled' | 'Postponed' | 'Cancelled' | 'Completed';
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: props.name,
    description: props.description,
    startDate: props.startDate,
    url: `${BASE_URL}${props.url}`,
    eventStatus: `https://schema.org/Event${props.status || 'Scheduled'}`,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: {
      '@type': 'SportsOrganization',
      name: props.organizerName || 'Sport Data Angola',
      url: BASE_URL,
    },
  };

  if (props.endDate) schema.endDate = props.endDate;
  if (props.image) schema.image = props.image;
  if (props.location) {
    schema.location = {
      '@type': 'Place',
      name: props.location,
      address: { '@type': 'PostalAddress', addressCountry: 'AO' },
    };
  }
  if (props.sport) schema.sport = props.sport;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function PersonLD(props: {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  athlete?: boolean;
  birthDate?: string;
  nationality?: string;
  gender?: string;
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': props.athlete ? 'Person' : 'Person',
    name: props.name,
  };

  if (props.description) schema.description = props.description;
  if (props.image) schema.image = props.image;
  if (props.url) schema.url = `${BASE_URL}${props.url}`;
  if (props.birthDate) schema.birthDate = props.birthDate;
  if (props.nationality) schema.nationality = props.nationality;
  if (props.gender) schema.gender = props.gender;

  if (props.athlete) {
    schema.hasOccupation = {
      '@type': 'Occupation',
      name: 'Atleta',
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function LocalBusinessLD() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sport Data Angola',
    applicationCategory: 'SportsApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AOA',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
