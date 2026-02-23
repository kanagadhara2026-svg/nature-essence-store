import { Droplets, Flower2, Pill, Sparkles } from "lucide-react";

const categories = [
  { icon: Flower2, title: "Skincare", description: "Serums, creams & masks", count: 24, color: "primary" },
  { icon: Droplets, title: "Essential Oils", description: "Therapeutic-grade blends", count: 18, color: "accent" },
  { icon: Pill, title: "Supplements", description: "Herbs & adaptogens", count: 32, color: "leaf" },
  { icon: Sparkles, title: "Bath & Body", description: "Soaps, scrubs & rituals", count: 15, color: "orchid" },
];

const colorMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary group-hover:bg-primary/20",
  accent: "bg-accent/10 text-accent group-hover:bg-accent/20",
  leaf: "bg-leaf/10 text-leaf group-hover:bg-leaf/20",
  orchid: "bg-orchid/10 text-orchid group-hover:bg-orchid/20",
};

const Categories = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-gradient-section relative">
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
              Browse By
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Shop <span className="text-gradient">Categories</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {categories.map(({ icon: Icon, title, description, count, color }) => (
            <div
              key={title}
              className="group card-3d-hover rounded-2xl p-5 sm:p-7 text-center cursor-pointer"
            >
              <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl ${colorMap[color]} flex items-center justify-center mx-auto mb-4 transition-colors`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 hidden sm:block">{description}</p>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{count} Products</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
