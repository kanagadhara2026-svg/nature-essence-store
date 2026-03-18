import { useState } from "react";
import { Search, Menu, X, Settings, User, Package, MapPin, Home, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import CartDrawer from "./CartDrawer";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const navLinks = ["Shop", "About", "Ingredients", "Journal", "Contact"];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16 lg:h-20">
          <a href="/" className="flex items-center gap-2" aria-label="Kanagadhara Home">
            <img src={logo} alt="Kanagadhara Herbal Beauty & Wellness" className="h-9 sm:h-11 lg:h-14 w-auto" />
          </a>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase">
                {link}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button aria-label="Search products" className="hidden sm:flex text-muted-foreground hover:text-primary transition-colors p-2">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/track" className="hidden sm:flex text-muted-foreground hover:text-primary transition-colors p-2" aria-label="Track Order">
              <MapPin className="h-5 w-5" />
            </Link>
            <CartDrawer />
            {user && (
              <Link to="/my-orders" className="hidden sm:flex text-muted-foreground hover:text-primary transition-colors p-2" aria-label="My Orders">
                <Package className="h-5 w-5" />
              </Link>
            )}
            {!user && (
              <Link to="/auth" className="hidden sm:flex text-muted-foreground hover:text-primary transition-colors p-2" aria-label="Sign In">
                <User className="h-5 w-5" />
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors p-2" aria-label="Admin Dashboard">
                <Settings className="h-5 w-5" />
              </Link>
            )}
            <button aria-label="Open menu" className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-2 -mr-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden glass-strong animate-fade-in border-t border-border/30">
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase py-1" onClick={() => setMobileOpen(false)}>
                  {link}
                </a>
              ))}
              <Link to="/track" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase py-1" onClick={() => setMobileOpen(false)}>
                Track Order
              </Link>
              {user && (
                <Link to="/my-orders" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase py-1" onClick={() => setMobileOpen(false)}>
                  My Orders
                </Link>
              )}
              {!user && (
                <Link to="/auth" className="text-base font-medium text-primary hover:text-foreground transition-colors tracking-wide uppercase py-1" onClick={() => setMobileOpen(false)}>
                  Sign In / Sign Up
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden glass-strong border-t border-border/30 safe-area-bottom" aria-label="Mobile bottom navigation">
        <div className="flex items-center justify-around h-16 px-2">
          <a href="/" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors min-w-[3rem] py-1">
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Home</span>
          </a>
          <a href="#shop" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors min-w-[3rem] py-1">
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[10px] font-medium">Shop</span>
          </a>
          <Link to="/track" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors min-w-[3rem] py-1">
            <MapPin className="h-5 w-5" />
            <span className="text-[10px] font-medium">Track</span>
          </Link>
          {user ? (
            <Link to="/my-orders" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors min-w-[3rem] py-1">
              <Package className="h-5 w-5" />
              <span className="text-[10px] font-medium">Orders</span>
            </Link>
          ) : (
            <Link to="/auth" className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors min-w-[3rem] py-1">
              <User className="h-5 w-5" />
              <span className="text-[10px] font-medium">Account</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
