import { Leaf, Recycle, Heart, Shield } from "lucide-react";

const values = [
  { icon: Leaf, title: "100% Organic", text: "Every ingredient is certified organic and ethically sourced from trusted farms." },
  { icon: Recycle, title: "Eco-Friendly", text: "Sustainable packaging with zero-waste practices across our entire supply chain." },
  { icon: Heart, title: "Cruelty Free", text: "Never tested on animals. We believe in beauty that doesn't harm any living being." },
  { icon: Shield, title: "Lab Tested", text: "Rigorous third-party testing ensures the highest purity and potency standards." },
];

const BrandValues = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">Why Botanica</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
            Rooted in Nature, Backed by Science
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-5">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandValues;
