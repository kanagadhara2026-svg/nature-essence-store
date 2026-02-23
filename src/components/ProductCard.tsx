import { ShoppingBag, Star } from "lucide-react";

interface ProductCardProps {
  image: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  isNew?: boolean;
}

const ProductCard = ({ image, name, category, price, originalPrice, rating, isNew }: ProductCardProps) => {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg bg-card aspect-square mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {isNew && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            New
          </span>
        )}
        <button
          aria-label={`Add ${name} to cart`}
          className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>

      {/* Info */}
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{category}</p>
      <h3 className="font-serif text-lg font-medium text-foreground mb-1.5 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < rating ? "fill-accent text-accent" : "text-border"}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">${price.toFixed(2)}</span>
        {originalPrice && (
          <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
