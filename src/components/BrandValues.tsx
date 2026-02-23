import { Leaf, Recycle, Heart, Shield } from "lucide-react";

const values = [
  { icon: Leaf, title: "100% Organic", text: "Certified organic ingredients, ethically sourced from trusted farms.", color: "leaf" },
  { icon: Recycle, title: "Eco-Friendly", text: "Sustainable packaging with zero-waste practices throughout.", color: "accent" },
  { icon: Heart, title: "Cruelty Free", text: "Never tested on animals. Beauty that doesn't harm.", color: "rose" },
  { icon: Shield, title: "Lab Tested", text: "Third-party tested for the highest purity and potency.", color: "sky" },
];

const colorMap: Record<string, string> = {
  leaf: "bg-leaf text-background",
  accent: "bg-accent text-accent-foreground",
  rose: "bg-rose text-background",
  sky: "bg-sky text-background",
};

const glowMap: Record<string, string> = {
  leaf: "shadow-[0_8px_30px_-8px_hsl(155_50%_42%/0.3)]",
  accent: "shadow-[0_8px_30px_-8px_hsl(32_85%_55%/0.3)]",
  rose: "shadow-[0_8px_30px_-8px_hsl(340_65%_55%/0.3)]",
  sky: "shadow-[0_8px_30px_-8px_hsl(210_70%_58%/0.3)]",
};

const BrandValues = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28 relative">
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/5 blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
              Why Kanagadhara
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Rooted in Nature, <br className="hidden sm:block" />
            <span className="text-gradient">Backed by Science</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {values.map(({ icon: Icon, title, text, color }) => (
            <div key={title} className="text-center card-3d rounded-2xl p-5 sm:p-6">
              <div className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl ${colorMap[color]} ${glowMap[color]} flex items-center justify-center mx-auto mb-4`}>
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-serif text-sm sm:text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed hidden sm:block">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandValues;
