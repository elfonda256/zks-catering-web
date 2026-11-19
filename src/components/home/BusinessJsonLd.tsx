import { COMPANY_PROFILE } from "@/data/catering-data";
import { SITE_URL } from "@/lib/site-url";

/** schema.org structured data so search engines can show ZKS as a local business. */
export default function BusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "ZKS Catering",
    legalName: COMPANY_PROFILE.name,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image.jpg`,
    logo: `${SITE_URL}/images/zks-emblem.png`,
    telephone: `+${COMPANY_PROFILE.mainWhatsApp}`,
    servesCuisine: "Indonesian",
    foundingDate: "2007",
    areaServed: "Kabupaten Karawang",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Perumahan Griya Indah Blok D1 No. 19, Desa Parung Mulya",
      addressLocality: "Ciampel",
      addressRegion: "Kabupaten Karawang, Jawa Barat",
      postalCode: "41361",
      addressCountry: "ID",
    },
  };

  return (
    <script
      type="application/ld+json"
      // Static data from our own constants; safe to serialize.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
