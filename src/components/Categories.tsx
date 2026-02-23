import { Droplets, Flower2, Pill, Sparkles } from "lucide-react";

const categories = [
  { icon: Flower2, title: "Skincare", description: "Nourishing serums, creams & masks", count: 24 },
  { icon: Droplets, title: "Essential Oils", description: "Pure therapeutic-grade blends", count: 18 },
  { icon: Pill, title: "Supplements", description: "Vitamins, herbs & adaptogens", count: 32 },
  { icon: Sparkles, title: "Bath & Body", description: "Soaps, scrubs & bath rituals", count: 15 },
];

const Categories = () => {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">Browse By</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
            Shop Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(({ icon: Icon, title, description, count }) => (
            <div
              key={title}
              className="group bg-background rounded-xl p-8 text-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/20"
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{description}</p>
              <span className="text-xs text-accent font-semibold uppercase tracking-wider">{count} Products</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
