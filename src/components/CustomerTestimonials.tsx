import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Kanagadhara's herbal face wash transformed my skin in just 2 weeks. The natural ingredients truly make a difference — no more breakouts!",
    product: "Herbal Face Wash",
  },
  {
    name: "Anita Reddy",
    location: "Hyderabad",
    rating: 5,
    text: "I switched to their organic hair oil and the results are incredible. My hair feels stronger and the fragrance is divine. Highly recommend!",
    product: "Organic Hair Oil",
  },
  {
    name: "Ravi Kumar",
    location: "Bangalore",
    rating: 4,
    text: "The turmeric body lotion is amazing for dry skin. It's gentle, absorbs quickly, and keeps my skin moisturized all day. Great quality products.",
    product: "Turmeric Body Lotion",
  },
  {
    name: "Meena Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "Been using their aloe vera gel for 6 months now. It soothes sunburn instantly and keeps my skin hydrated. Best natural skincare I've found.",
    product: "Aloe Vera Gel",
  },
  {
    name: "Suresh Nair",
    location: "Kerala",
    rating: 5,
    text: "The herbal shampoo is chemical-free and leaves my scalp feeling refreshed. My family has completely switched to Kanagadhara products!",
    product: "Herbal Shampoo",
  },
  {
    name: "Kavitha Devi",
    location: "Chennai",
    rating: 4,
    text: "I love the eco-friendly packaging and the quality of their lip balm. It's gentle, nourishing, and perfect for everyday use. Will buy again!",
    product: "Herbal Lip Balm",
  },
];

const CustomerTestimonials = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
              Real Reviews
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Thousands of happy customers trust Kanagadhara for their daily skincare and wellness rituals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="card-3d rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />

              <div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-3.5 w-3.5 ${
                        j < t.rating
                          ? "fill-accent text-accent"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-primary/70 font-medium bg-primary/5 px-2.5 py-1 rounded-full">
                  {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
