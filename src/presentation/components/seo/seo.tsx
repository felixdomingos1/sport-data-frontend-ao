import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  noindex?: boolean;
}

const SITE_NAME = 'Sport Data Angola';
const BASE_URL = 'https://sportdataangola.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
const DEFAULT_DESC =
  'Plataforma angolana de gestão desportiva — federações, atletas, clubes, competições e rankings nacionais.';
const DEFAULT_KEYWORDS =
  'desporto angola, federações angola, atletas angola, gestão desportiva, sport data angola, basquetebol angola, futebol angola, ranking desportivo, campeonatos angola, competições angola, licença desportiva angola';

export function SEO({
  title,
  description,
  canonical,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  imageAlt = 'Sport Data Angola — Plataforma de gestão desportiva',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  noindex = false,
}: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_AO" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@sportdataangola" />
      <meta name="twitter:creator" content="@sportdataangola" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* Article (optional) */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}

      {/* Robots */}
      {noindex ? (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </>
      ) : (
        <>
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        </>
      )}
      <meta name="bingbot" content="index, follow" />

      {/* Language & Geo */}
      <meta httpEquiv="content-language" content="pt-AO" />
      <meta name="language" content="Portuguese" />
      <meta name="geo.region" content="AO" />
      <meta name="geo.country" content="Angola" />
      <meta name="geo.placename" content="Luanda" />

      {/* Mobile / PWA */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Sport Data Angola" />

      {/* Monetization / Ads */}
      <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXX" />

      {/* Verification */}
      <meta name="facebook-domain-verification" content="" />
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
