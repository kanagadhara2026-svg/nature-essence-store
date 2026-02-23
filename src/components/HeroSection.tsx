import heroImage from "@/assets/hero-botanical.jpg";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Natural herbal products with botanical ingredients"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 pt-20">
        <div className="max-w-xl">
          <p
            className="text-sage text-sm uppercase tracking-[0.3em] mb-4 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Pure · Natural · Botanical
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-primary-foreground leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Nature's Remedy,{" "}
            <span className="italic font-normal">Crafted for You</span>
          </h1>
          <p
            className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed mb-8 font-light animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            Discover our curated collection of handcrafted herbal products, 
            sourced from organic farms and blended with centuries-old wisdom.
          </p>
          <div
            className="flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: "0.7s" }}
          >
            <Button variant="hero" size="lg">
              Shop Collection
            </Button>
            <Button variant="heroOutline" size="lg">
              Our Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
