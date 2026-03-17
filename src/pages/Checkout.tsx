import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Banknote, CreditCard, CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo.jpg";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Load Razorpay script
  useEffect(() => {
    if (document.getElementById("razorpay-script")) {
      setRazorpayLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Redirect to auth if not logged in
  if (!user) {
    return (
      <div className="min-h-[100svh] flex flex-col items-center justify-center bg-background px-4">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="font-serif text-xl text-foreground mb-2">Sign in to place your order</h2>
        <p className="text-sm text-muted-foreground mb-4 text-center">Create an account to complete your purchase and track your orders</p>
        <Button variant="hero" onClick={() => navigate("/auth")}>Sign Up / Login</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[100svh] flex flex-col items-center justify-center bg-background px-4">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="font-serif text-xl text-foreground mb-2">Your cart is empty</h2>
        <Button variant="hero" onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    );
  }

  const createOrder = async () => {
    const orderPayload: any = {
      user_id: user.id,
      delivery_name: form.name.trim(),
      delivery_phone: form.phone.trim(),
      delivery_address: form.address.trim(),
      delivery_city: form.city.trim(),
      delivery_state: form.state.trim(),
      delivery_pincode: form.pincode.trim(),
      payment_method: paymentMethod,
      payment_status: "pending",
      total_amount: totalAmount,
      status: "pending",
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select()
      .single();

    if (orderError) throw orderError;

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

    return order;
  };

  const handleRazorpayPayment = async (order: any) => {
    // Create Razorpay order via edge function
    const { data: rzpData, error: rzpError } = await supabase.functions.invoke(
      "create-razorpay-order",
      {
        body: { amount: totalAmount, order_id: order.id },
      }
    );

    if (rzpError || rzpData?.error) {
      throw new Error(rzpData?.error || rzpError?.message || "Failed to create payment order");
    }

    return new Promise<void>((resolve, reject) => {
      const options = {
        key: rzpData.razorpay_key_id,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: "Kanagadhara",
        description: `Order #${order.id.slice(0, 8).toUpperCase()}`,
        order_id: rzpData.razorpay_order_id,
        handler: async (response: any) => {
          try {
            // Verify payment via edge function
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: order.id,
                },
              }
            );

            if (verifyError || verifyData?.error) {
              throw new Error(verifyData?.error || "Payment verification failed");
            }

            resolve();
          } catch (err) {
            reject(err);
          }
        },
        prefill: {
          name: form.name,
          email: form.email || undefined,
          contact: form.phone,
        },
        theme: {
          color: "#4a7c59",
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment cancelled"));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (paymentMethod === "razorpay" && !razorpayLoaded) {
      toast({ title: "Error", description: "Payment gateway is loading, please wait...", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder();

      if (paymentMethod === "razorpay") {
        await handleRazorpayPayment(order);
        clearCart();
        toast({ title: "Payment Successful! 🎉", description: `Order #${order.id.slice(0, 8).toUpperCase()} confirmed` });
        navigate(`/order/${order.id}`);
      } else {
        // COD
        clearCart();
        toast({ title: "Order Placed! 🎉", description: `Order ID: ${order.id.slice(0, 8).toUpperCase()}` });
        navigate(`/order/${order.id}`);
      }
    } catch (err: any) {
      if (err.message === "Payment cancelled") {
        toast({ title: "Payment Cancelled", description: "You can retry or choose Cash on Delivery", variant: "destructive" });
      } else {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
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
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("razorpay")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  paymentMethod === "razorpay"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary hover:border-primary/50"
                }`}
              >
                {paymentMethod === "razorpay" ? (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                ) : (
                  <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Pay Online (Razorpay)</p>
                  <p className="text-xs text-muted-foreground">UPI, Cards, Net Banking, Wallets</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary hover:border-primary/50"
                }`}
              >
                {paymentMethod === "cod" ? (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                ) : (
                  <Banknote className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                </div>
              </button>
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full h-14 text-base" disabled={submitting}>
            {submitting
              ? "Processing..."
              : paymentMethod === "razorpay"
              ? `Pay ₹${totalAmount.toLocaleString("en-IN")}`
              : `Place Order — ₹${totalAmount.toLocaleString("en-IN")}`}
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
