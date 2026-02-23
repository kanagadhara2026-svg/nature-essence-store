import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <img src={logo} alt="Kanagadhara" className="h-14 w-auto mb-4 brightness-150" />
            <p className="text-sm opacity-60 leading-relaxed">
              Handcrafted herbal beauty and wellness products inspired by nature's wisdom. Organic, sustainable, and made with love.
            </p>
          </div>

          {[
            { heading: "Shop", links: ["All Products", "Skincare", "Essential Oils", "Supplements", "Bath & Body"] },
            { heading: "Company", links: ["About Us", "Our Story", "Sustainability", "Journal", "Careers"] },
            { heading: "Support", links: ["Contact", "FAQs", "Shipping", "Returns", "Track Order"] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-50">© 2026 Kanagadhara Herbal Beauty & Wellness. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <a key={link} href="#" className="text-xs opacity-50 hover:opacity-100 transition-opacity">
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
