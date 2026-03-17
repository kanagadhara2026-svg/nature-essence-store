import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Star, ArrowLeft, Send } from "lucide-react";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const imageMap: Record<string, string> = {
  "/product-1": product1,
  "/product-2": product2,
  "/product-3": product3,
  "/product-4": product4,
  "/product-5": product5,
  "/product-6": product6,
};

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("products").select("*").eq("id", id).single(),
      supabase.from("product_reviews").select("*").eq("product_id", id).order("created_at", { ascending: false }),
    ]).then(([productRes, reviewsRes]) => {
      if (productRes.data) setProduct(productRes.data);
      if (reviewsRes.data) setReviews(reviewsRes.data);
      setLoading(false);
    });
  }, [id]);

  const handleBuyNow = () => {
    if (!product) return;
    addItem({ id: product.id, name: product.name, price: product.price, image: resolveImage(product.image_url), brand: product.brand });
    navigate("/checkout");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("product_reviews").insert({
      product_id: id!,
      reviewer_name: reviewerName.trim().slice(0, 100),
      rating: reviewRating,
      comment: reviewComment.trim().slice(0, 1000),
    });
    if (error) {
      toast({ title: "Failed to submit review", variant: "destructive" });
    } else {
      toast({ title: "Review submitted!" });
      setReviewerName("");
      setReviewRating(5);
      setReviewComment("");
      // Refresh reviews
      const { data } = await supabase.from("product_reviews").select("*").eq("product_id", id!).order("created_at", { ascending: false });
      if (data) setReviews(data);
    }
    setSubmitting(false);
  };

  const resolveImage = (url: string | null) => imageMap[url || ""] || url || product1;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Product not found.</div>
        <Footer />
      </div>
    );
  }

  const avgRating = reviews.length > 0 ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : product.rating;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-16">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Product Info */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 mb-16">
          <div className="rounded-2xl overflow-hidden aspect-square">
            <img src={resolveImage(product.image_url)} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            {product.brand && <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-1">{product.brand}</p>}
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">{product.category}</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < avgRating ? "fill-accent text-accent" : "text-border"}`} />
              ))}
              <span className="text-sm text-muted-foreground ml-2">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl font-bold text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
              {product.original_price && <span className="text-lg text-muted-foreground line-through">₹{product.original_price.toLocaleString("en-IN")}</span>}
            </div>
            {product.description && <p className="text-muted-foreground text-sm leading-relaxed mb-6">{product.description}</p>}
            <Button onClick={handleAddToCart} size="lg" className="w-full sm:w-auto gap-2">
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-8">
            Customer <span className="text-gradient">Reviews</span>
          </h2>

          {/* Review Form */}
          <form onSubmit={handleSubmitReview} className="glass rounded-2xl p-6 mb-10 space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Write a Review</h3>
            <Input
              placeholder="Your name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              maxLength={100}
              required
            />
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button type="button" key={s} onClick={() => setReviewRating(s)}>
                    <Star className={`h-6 w-6 cursor-pointer transition ${s <= reviewRating ? "fill-accent text-accent" : "text-border"}`} />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Share your experience with this product..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              maxLength={1000}
              required
            />
            <Button type="submit" disabled={submitting} className="gap-2">
              <Send className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>

          {/* Review List */}
          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="space-y-5">
              {reviews.map((r) => (
                <div key={r.id} className="glass rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">{r.reviewer_name}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("en-IN")}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-accent text-accent" : "text-border"}`} />
                    ))}
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
