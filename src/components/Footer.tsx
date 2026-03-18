import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="border-t border-border pt-12 sm:pt-16 pb-24 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10 sm:mb-12">
          <div className="col-span-2 lg:col-span-1">
            <img src={logo} alt="Kanagadhara — Natural Herbal Beauty & Wellness Products" className="h-12 sm:h-14 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Handcrafted herbal beauty and wellness products inspired by nature's wisdom. Organic skincare, essential oils & supplements.
            </p>
          </div>

          {[
            { heading: "Shop", links: ["All Products", "Skincare", "Essential Oils", "Supplements", "Bath & Body"] },
            { heading: "Company", links: ["About Us", "Our Story", "Sustainability", "Journal"] },
            { heading: "Support", links: ["Contact", "FAQs", "Shipping", "Returns"] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-foreground mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground/60">© 2026 Kanagadhara Herbal Beauty & Wellness. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((link) => (
              <a key={link} href="#" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors py-1">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
