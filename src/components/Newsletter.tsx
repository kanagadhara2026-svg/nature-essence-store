import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 text-center">
        <Leaf className="h-10 w-10 mx-auto mb-6 opacity-60" />
        <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-4">
          Join the Kanagadhara Family
        </h2>
        <p className="max-w-md mx-auto mb-8 opacity-80 leading-relaxed">
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
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 flex-1"
          />
          <Button variant="newsletter" size="lg">
            Subscribe
          </Button>
        </form>
        <p className="text-xs opacity-50 mt-4">No spam, unsubscribe anytime.</p>
      </div>
    </section>
  );
};

export default Newsletter;
