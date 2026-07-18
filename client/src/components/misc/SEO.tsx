import { Helmet } from "react-helmet-async";

export type SEOInfo = {
  title: string;
  description: string;
  image?: string;
  url?: string;
};
const siteName = "DevManDan";

export default function SEO({
  title,
  description,
  image,
  url,
}: SEOInfo) {
  const fullTitle = `${title} | ${siteName}`;
  const currentURL = typeof window !== "undefined" && (window.location.origin + window.location.pathname);
  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta
        name="description"
        content={description}
      />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />

      {image && (
        <meta property="og:image" content={image} />
      )}

      {url || currentURL && (
        <meta property="og:url" content={url ?? currentURL} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {image && (
        <meta name="twitter:image" content={image} />
      )}

      {url || currentURL && (
        <link rel="canonical" href={url ?? currentURL} />
      )}
    </Helmet>
  );
}