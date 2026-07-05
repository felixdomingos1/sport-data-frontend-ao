import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  author?: string;
}

const SITE_NAME = 'Sport Data Angola';
const BASE_URL = 'https://sportdataangola.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
const DEFAULT_DESC = 'Plataforma angolana de gestão desportiva — federações, atletas, clubes, competições e rankings nacionais.';

export function SEO({
  title,
  description,
  canonical,
  keywords = 'desporto angola, federações angola, atletas angola, gestão desportiva, sport data angola, basquetebol angola, futebol angola, ranking desportivo',
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  author,
}: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_AO" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}

      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Portuguese" />
      <meta name="geo.region" content="AO" />
      <meta name="geo.country" content="Angola" />
    </Helmet>
  );
}

export function DefaultSEO() {
  return (
    <SEO
      title="Sport Data Angola"
      description={DEFAULT_DESC}
      canonical="/"
    />
  );
}
