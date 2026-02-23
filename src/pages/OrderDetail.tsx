import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, CheckCircle, Truck, MapPin, Box, RotateCcw, XCircle } from "lucide-react";
import logo from "@/assets/logo.jpg";

const statusSteps = [
  { key: "pending", label: "Pending", icon: Package },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "packed", label: "Packed", icon: Box },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("orders").select("*").eq("id", id).single(),
      supabase.from("order_items").select("*").eq("order_id", id),
    ]).then(([orderRes, itemsRes]) => {
      if (orderRes.data) setOrder(orderRes.data);
      if (itemsRes.data) setItems(itemsRes.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="min-h-[100svh] flex items-center justify-center bg-background text-foreground">Loading...</div>;
  if (!order) return <div className="min-h-[100svh] flex items-center justify-center bg-background text-foreground">Order not found</div>;

  const isCancelled = order.status === "cancelled";
  const isReturned = order.status === "returned";
  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-[100svh] bg-background">
      <header className="glass-strong border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img src={logo} alt="Kanagadhara" className="h-8" />
        <h1 className="font-serif text-lg font-semibold text-foreground">Order Details</h1>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Order ID & Status */}
        <div className="card-3d rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Order ID</p>
            <p className="text-xs font-mono text-primary">{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-xs text-foreground">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">Payment</p>
            <p className="text-xs text-foreground">{order.payment_method === "cod" ? "Cash on Delivery" : "Online"} — {order.payment_status}</p>
          </div>
        </div>

        {/* Tracking Progress */}
        {!isCancelled && !isReturned ? (
          <div className="card-3d rounded-2xl p-4 mb-6">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Tracking</h2>
            <div className="space-y-0">
              {statusSteps.map((step, i) => {
                const Icon = step.icon;
                const isCompleted = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ${isCurrent ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background" : ""}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-8 ${i < currentStepIndex ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card-3d rounded-2xl p-4 mb-6 flex items-center gap-3">
            {isCancelled ? <XCircle className="h-8 w-8 text-destructive" /> : <RotateCcw className="h-8 w-8 text-accent" />}
            <div>
              <h2 className="font-serif text-lg font-semibold text-foreground">{isCancelled ? "Order Cancelled" : "Order Returned"}</h2>
              <p className="text-sm text-muted-foreground">Contact support for more details</p>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="card-3d rounded-2xl p-4 mb-6">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Items</h2>
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              {item.product_image && <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover" />}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-foreground">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
            </div>
          ))}
          <div className="flex justify-between mt-3 pt-3 border-t border-border">
            <span className="font-bold text-foreground">Total</span>
            <span className="font-bold text-primary text-lg">₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="card-3d rounded-2xl p-4 mb-6">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-2">Delivery Address</h2>
          <p className="text-sm text-foreground">{order.delivery_name}</p>
          <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
          <p className="text-sm text-muted-foreground">{order.delivery_city}, {order.delivery_state} — {order.delivery_pincode}</p>
          <p className="text-sm text-muted-foreground">📞 {order.delivery_phone}</p>
        </div>

        <Button variant="hero" className="w-full" onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    </div>
  );
};

export default OrderDetail;
