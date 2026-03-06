import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Are Kanagadhara products 100% natural?",
    a: "Yes, all our products are made with certified organic ingredients sourced from trusted farms. We use no synthetic chemicals, parabens, or sulfates.",
  },
  {
    q: "Is Kanagadhara cruelty-free?",
    a: "Absolutely. None of our products are tested on animals. We are committed to ethical and sustainable beauty practices.",
  },
  {
    q: "How can I track my order?",
    a: "You can track your order using the 'Track Order' link in the navigation bar. Enter your order ID and phone number to see real-time status updates.",
  },
  {
    q: "Do I need to register to place an order?",
    a: "No registration is required. Simply provide your phone number and delivery address to place an order as a guest. Registration is optional and lets you view order history.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently accept Cash on Delivery (COD) and online payments via Razorpay (UPI, cards, net banking, wallets).",
  },
  {
    q: "What is your return policy?",
    a: "We offer hassle-free returns within 7 days of delivery if the product is unused and in its original packaging. Contact our support for assistance.",
  },
];

const FaqSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-28 relative">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-leaf/5 blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 relative max-w-3xl">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
              Common Questions
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Frequently <span className="text-gradient">Asked</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="card-3d rounded-2xl px-5 sm:px-6 border-none"
            >
              <AccordionTrigger className="text-sm sm:text-base font-semibold text-foreground hover:text-primary py-4 sm:py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 sm:pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
