import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "./ProductCard";
import type { Tables } from "@/integrations/supabase/types";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const imageMap: Record<string, string> = {
  "/product-1": product1,
  "/product-2": product2,
  "/product-3": product3,
  "/product-4": product4,
  "/product-5": product5,
  "/product-6": product6,
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Tables<"products">[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (data) setProducts(data);
      });
  }, []);

  return (
    <section id="shop" className="py-16 sm:py-20 lg:py-28 relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
              Curated Selection
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-gradient">Bestsellers</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Each product is thoughtfully crafted using sustainably sourced herbs and time-honored botanical traditions.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-8">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              image={imageMap[p.image_url || ""] || p.image_url || product1}
              name={p.name}
              category={p.category}
              price={p.price}
              originalPrice={p.original_price ?? undefined}
              rating={p.rating}
              isNew={p.is_new}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
