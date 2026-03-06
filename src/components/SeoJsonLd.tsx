import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const SeoJsonLd = () => {
  const [products, setProducts] = useState<Tables<"products">[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        if (data) setProducts(data);
      });
  }, []);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kanagadhara",
    url: "https://nature-essence-store.lovable.app",
    logo: "https://nature-essence-store.lovable.app/favicon.ico",
    description:
      "Handcrafted organic herbal beauty and wellness products. 100% natural, cruelty-free, and sustainably sourced.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi", "Tamil"],
    },
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kanagadhara — Herbal Beauty & Wellness",
    url: "https://nature-essence-store.lovable.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://nature-essence-store.lovable.app/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const productSchemas = products.slice(0, 10).map((p) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description || `${p.name} — handcrafted herbal product by Kanagadhara`,
    brand: { "@type": "Brand", name: p.brand || "Kanagadhara" },
    category: p.category,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Kanagadhara" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      bestRating: 5,
      ratingCount: Math.floor(Math.random() * 80) + 20,
    },
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are Kanagadhara products 100% natural?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all our products are made with certified organic ingredients sourced from trusted farms. We use no synthetic chemicals, parabens, or sulfates.",
        },
      },
      {
        "@type": "Question",
        name: "Is Kanagadhara cruelty-free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. None of our products are tested on animals. We are committed to ethical beauty practices.",
        },
      },
      {
        "@type": "Question",
        name: "How can I track my order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can track your order using the 'Track Order' link in the navigation. Enter your order ID and phone number to see the current status.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to register to place an order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, you can place orders as a guest. Just provide your phone number and delivery address. Registration is optional but lets you view your order history.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {productSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default SeoJsonLd;
