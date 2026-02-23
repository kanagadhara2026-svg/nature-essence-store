import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, CreditCard, Banknote } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  if (items.length === 0) {
    return (
      <div className="min-h-[100svh] flex flex-col items-center justify-center bg-background px-4">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="font-serif text-xl text-foreground mb-2">Your cart is empty</h2>
        <Button variant="hero" onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Create order
      const orderPayload: any = {
        delivery_name: form.name.trim(),
        delivery_phone: form.phone.trim(),
        delivery_address: form.address.trim(),
        delivery_city: form.city.trim(),
        delivery_state: form.state.trim(),
        delivery_pincode: form.pincode.trim(),
        payment_method: paymentMethod,
        payment_status: paymentMethod === "cod" ? "pending" : "pending",
        total_amount: totalAmount,
        status: "pending",
      };

      if (user) {
        orderPayload.user_id = user.id;
      } else {
        orderPayload.guest_name = form.name.trim();
        orderPayload.guest_email = form.email.trim() || null;
        orderPayload.guest_phone = form.phone.trim();
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      toast({ title: "Order Placed! 🎉", description: `Order ID: ${order.id.slice(0, 8).toUpperCase()}` });
      navigate(`/order/${order.id}`);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-background">
      <header className="glass-strong border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img src={logo} alt="Kanagadhara" className="h-8" />
        <h1 className="font-serif text-lg font-semibold text-foreground">Checkout</h1>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Order Summary */}
        <div className="card-3d rounded-2xl p-4 mb-6">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-foreground">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
            </div>
          ))}
          <div className="flex justify-between mt-3 pt-3 border-t border-border">
            <span className="text-base font-bold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Delivery Form */}
        <form onSubmit={handleSubmit}>
          <div className="card-3d rounded-2xl p-4 mb-6">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Delivery Details</h2>
            <div className="space-y-3">
              <Input placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-secondary border-border rounded-xl h-11" />
              <Input placeholder="Phone Number *" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="bg-secondary border-border rounded-xl h-11" />
              {!user && (
                <Input placeholder="Email (optional, for order updates)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary border-border rounded-xl h-11" />
              )}
              <Input placeholder="Delivery Address *" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required className="bg-secondary border-border rounded-xl h-11" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className="bg-secondary border-border rounded-xl h-11" />
                <Input placeholder="State *" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required className="bg-secondary border-border rounded-xl h-11" />
              </div>
              <Input placeholder="PIN Code *" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required className="bg-secondary border-border rounded-xl h-11" />
            </div>
          </div>

          {/* Payment Method */}
          <div className="card-3d rounded-2xl p-4 mb-6">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Payment Method</h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/10" : "border-border bg-secondary/50"}`}
              >
                <Banknote className={`h-5 w-5 ${paymentMethod === "cod" ? "text-primary" : "text-muted-foreground"}`} />
                <div className="text-left">
                  <p className={`text-sm font-semibold ${paymentMethod === "cod" ? "text-foreground" : "text-muted-foreground"}`}>Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Pay when you receive</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("razorpay")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === "razorpay" ? "border-primary bg-primary/10" : "border-border bg-secondary/50"} opacity-50 cursor-not-allowed`}
                disabled
              >
                <CreditCard className={`h-5 w-5 ${paymentMethod === "razorpay" ? "text-primary" : "text-muted-foreground"}`} />
                <div className="text-left">
                  <p className="text-sm font-semibold text-muted-foreground">Pay Online (Razorpay)</p>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
              </button>
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full h-14 text-base" disabled={submitting}>
            {submitting ? "Placing Order..." : `Place Order — ₹${totalAmount.toLocaleString("en-IN")}`}
          </Button>

          {!user && (
            <p className="text-center text-xs text-muted-foreground mt-3">
              Want to track your orders?{" "}
              <button type="button" onClick={() => navigate("/auth")} className="text-primary font-semibold hover:underline">
                Sign up
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Checkout;
