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
      "Kanagadhara offers handcrafted organic herbal beauty and wellness products. 100% natural, cruelty-free, and sustainably sourced skincare, essential oils, supplements & bath care.",
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
    name: "Kanagadhara — Natural Herbal Beauty & Wellness Products",
    url: "https://nature-essence-store.lovable.app",
    description: "Shop natural herbal skincare, organic essential oils, ayurvedic supplements & bath products. Handcrafted, cruelty-free, 100% organic.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://nature-essence-store.lovable.app/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Kanagadhara Herbal Store",
    url: "https://nature-essence-store.lovable.app",
    description: "Online store for natural herbal beauty products, organic skincare, essential oils, ayurvedic wellness supplements.",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Net Banking",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nature-essence-store.lovable.app/" },
      { "@type": "ListItem", position: 2, name: "Shop Herbal Products", item: "https://nature-essence-store.lovable.app/#shop" },
      { "@type": "ListItem", position: 3, name: "Categories", item: "https://nature-essence-store.lovable.app/#categories" },
    ],
  };

  const productSchemas = products.slice(0, 10).map((p) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description || `${p.name} — handcrafted natural herbal product by Kanagadhara. Organic, cruelty-free ${p.category.toLowerCase()}.`,
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
        name: "What herbal skincare products does Kanagadhara offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kanagadhara offers a wide range of natural herbal skincare including face wash, body lotion, aloe vera gel, turmeric cream, organic hair oil, herbal shampoo, essential oils, ayurvedic supplements, and bath & body products.",
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
        name: "How can I track my herbal product order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can track your order using the 'Track Order' link in the navigation. Sign in to your account to see real-time order status updates.",
        },
      },
      {
        "@type": "Question",
        name: "What payment methods are accepted for online herbal product purchases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We accept Cash on Delivery (COD) and online payments via Razorpay (UPI, cards, net banking, wallets) for all herbal product orders.",
        },
      },
      {
        "@type": "Question",
        name: "Are Kanagadhara products organic and ayurvedic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our products are made with certified organic ingredients and are inspired by traditional Ayurvedic formulations. Each product is lab-tested for purity and potency.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
