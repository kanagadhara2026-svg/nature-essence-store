import { useState } from "react";
import { ShoppingBag, Search, Menu, X, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin } = useAuth();

  const navLinks = ["Shop", "About", "Ingredients", "Journal", "Contact"];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16 lg:h-20">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="Kanagadhara Herbal Beauty & Wellness" className="h-9 sm:h-11 lg:h-14 w-auto" />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <button aria-label="Search" className="text-muted-foreground hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button aria-label="Cart" className="relative text-muted-foreground hover:text-primary transition-colors">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
              3
            </span>
          </button>
          {isAdmin && (
            <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Admin">
              <Settings className="h-5 w-5" />
            </Link>
          )}
          <button
            aria-label="Menu"
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden glass-strong animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase"
                onClick={() => setMobileOpen(false)}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
