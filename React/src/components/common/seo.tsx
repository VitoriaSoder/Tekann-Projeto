import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title = 'SportsCourt | Gestão Inteligente de Arenas',
  description = 'A plataforma definitiva para gestores de arenas e jogadores. Reserve quadras de Padel, Tênis e Beach Tennis com facilidade.',
  keywords = 'reserva de quadras, gestão de arenas, padel, tênis, beach tennis',
  image = 'https://sportscourt.site/og-image.png',
  url = 'https://sportscourt.site/',
  type = 'website'
}: SEOProps) {
  const siteTitle = title.includes('SportsCourt') ? title : `${title} | SportsCourt`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
