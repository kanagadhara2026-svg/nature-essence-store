import ProductCard from "./ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const products = [
  { image: product1, name: "Golden Chamomile Elixir", category: "Herbal Teas", price: 28.00, rating: 5, isNew: true },
  { image: product2, name: "Forest Vitality Serum", category: "Skincare", price: 54.00, originalPrice: 68.00, rating: 5 },
  { image: product3, name: "Lavender Dream Cream", category: "Body Care", price: 36.00, rating: 4 },
  { image: product4, name: "Rosemary & Eucalyptus Oil", category: "Essential Oils", price: 24.00, rating: 5, isNew: true },
  { image: product5, name: "Botanical Flower Soap", category: "Bath & Body", price: 16.00, rating: 4 },
  { image: product6, name: "Turmeric Wellness Capsules", category: "Supplements", price: 42.00, rating: 5 },
];

const FeaturedProducts = () => {
  return (
    <section id="shop" className="py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">Curated Selection</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-4">
            Our Bestsellers
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Each product is thoughtfully crafted using sustainably sourced herbs and time-honored botanical traditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
