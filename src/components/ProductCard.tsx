import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
  const navigate = useNavigate();

  return (
    <article
      className="group cursor-pointer card-3d-hover rounded-2xl overflow-hidden"
      onClick={() => navigate(`/product/${id}`)}
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="relative overflow-hidden aspect-[4/5] sm:aspect-square">
        <img
          src={image}
          alt={`${name} - ${category} herbal product by Kanagadhara`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          itemProp="image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        {isNew && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">New</span>
        )}
        {originalPrice && (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-accent/90 backdrop-blur-sm text-accent-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Sale</span>
        )}
      </div>
      <div className="p-3 sm:p-4">
        {brand && <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-0.5" itemProp="brand">{brand}</p>}
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-1">{category}</p>
        <h3 className="font-serif text-sm sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2 group-hover:text-gradient transition-all line-clamp-2 sm:line-clamp-1" itemProp="name">{name}</h3>
        <div className="flex items-center gap-0.5 mb-2" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-accent text-accent" : "text-border"}`} />
          ))}
          <meta itemProp="ratingValue" content={String(rating)} />
        </div>
        <div className="flex items-center gap-2 mb-3 sm:mb-0" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <span className="text-base sm:text-lg font-bold text-foreground" itemProp="price" content={String(price)}>₹{price.toLocaleString("en-IN")}</span>
          <meta itemProp="priceCurrency" content="INR" />
          {originalPrice && <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{originalPrice.toLocaleString("en-IN")}</span>}
        </div>
        {/* Mobile Buy Now button */}
        <Button
          variant="hero"
          size="sm"
          className="w-full sm:hidden text-xs h-9 rounded-xl"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${id}`);
          }}
        >
          Buy Now
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
