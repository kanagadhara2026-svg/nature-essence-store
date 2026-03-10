import { ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  category: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  isNew?: boolean;
}

const ProductCard = ({ id, image, name, category, brand, price, originalPrice, rating, isNew }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id, name, price, image, brand });
    toast({ title: "Added to cart", description: name });
  };

  return (
    <div className="group cursor-pointer card-3d-hover rounded-2xl overflow-hidden">
      <div className="relative overflow-hidden aspect-square">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        {isNew && (
          <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">New</span>
        )}
        {originalPrice && (
          <span className="absolute top-3 right-3 bg-accent/90 backdrop-blur-sm text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Sale</span>
        )}
        <button
          onClick={handleAddToCart}
          aria-label={`Add ${name} to cart`}
          className="absolute bottom-3 right-3 h-10 w-10 rounded-xl glass flex items-center justify-center text-foreground opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        {brand && <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-0.5">{brand}</p>}
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-1.5">{category}</p>
        <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-2 group-hover:text-gradient transition-all line-clamp-1">{name}</h3>
        <div className="flex items-center gap-1 mb-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-accent text-accent" : "text-border"}`} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">₹{price.toLocaleString("en-IN")}</span>
          {originalPrice && <span className="text-sm text-muted-foreground line-through">₹{originalPrice.toLocaleString("en-IN")}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
