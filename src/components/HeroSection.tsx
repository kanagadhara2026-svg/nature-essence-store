import heroImage from "@/assets/hero-botanical.jpg";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85svh] sm:min-h-[100svh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Natural herbal beauty products with organic botanical ingredients by Kanagadhara"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
      </div>

      {/* Decorative glow orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-primary/10 blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-accent/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 pt-20 pb-20 sm:pb-12">
        <div className="max-w-2xl">
          <div
            className="inline-flex items-center gap-2 glass rounded-full px-3 sm:px-4 py-1.5 mb-4 sm:mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground font-medium">
              Pure · Natural · Botanical
            </span>
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-7xl font-serif font-bold leading-[1.1] mb-4 sm:mb-6 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Nature's Remedy,{" "}
            <span className="text-gradient italic font-normal">
              Crafted for You
            </span>
          </h1>

          <p
            className="text-muted-foreground text-sm sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 max-w-lg animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            Discover handcrafted organic herbal skincare, essential oils & wellness products — 100% natural, cruelty-free, sustainably sourced.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 animate-fade-up"
            style={{ animationDelay: "0.7s" }}
          >
            <Button variant="hero" size="lg" className="w-full sm:w-auto h-12 sm:h-auto text-base">
              Shop Collection
            </Button>
            <Button variant="heroOutline" size="lg" className="w-full sm:w-auto h-12 sm:h-auto text-base">
              Our Story
            </Button>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-4 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50 animate-fade-up"
            style={{ animationDelay: "0.9s" }}
          >
            {[
              { value: "500+", label: "Products" },
              { value: "50K+", label: "Customers" },
              { value: "100%", label: "Organic" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl sm:text-3xl font-serif font-bold text-gradient">{stat.value}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
