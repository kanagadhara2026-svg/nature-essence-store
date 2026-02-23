import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-16 sm:py-20 lg:py-28 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-primary/10 blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="card-3d rounded-3xl p-8 sm:p-12 lg:p-16 text-center max-w-2xl mx-auto relative overflow-hidden">
          {/* Inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 blur-[80px] rounded-full" />

          <div className="relative">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Join the <span className="text-gradient">Kanagadhara</span> Family
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
              Subscribe for exclusive offers, herbal wellness tips, and early access to new collections.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground flex-1 h-12 rounded-xl"
              />
              <Button variant="hero" size="lg" className="h-12 rounded-xl">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground/60 mt-4">No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
