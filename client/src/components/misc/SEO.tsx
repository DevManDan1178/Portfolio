import { Helmet } from "react-helmet-async";

export type SEOInfo = {title : string, description : string}

export default function SEO({ title, description } : SEOInfo) {
  return (
    <Helmet>
      <title>{String(title)}</title>

      <meta
        name="description"
        content={String(description)}
      />
    </Helmet>
  );
}