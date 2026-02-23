import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import logo from "@/assets/logo.jpg";

const statusColors: Record<string, string> = {
  pending: "bg-accent/20 text-accent",
  confirmed: "bg-sky/20 text-sky",
  packed: "bg-orchid/20 text-orchid",
  shipped: "bg-primary/20 text-primary",
  out_for_delivery: "bg-gold/20 text-gold",
  delivered: "bg-leaf/20 text-leaf",
  cancelled: "bg-destructive/20 text-destructive",
  returned: "bg-muted text-muted-foreground",
};

const MyOrders = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => { if (data) setOrders(data); });
    }
  }, [user]);

  return (
    <div className="min-h-[100svh] bg-background">
      <header className="glass-strong border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img src={logo} alt="Kanagadhara" className="h-8" />
        <h1 className="font-serif text-lg font-semibold text-foreground">My Orders</h1>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Button variant="hero" onClick={() => navigate("/")}>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => navigate(`/order/${order.id}`)}
                className="w-full card-3d rounded-2xl p-4 text-left hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-primary">#{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <span className="text-base font-bold text-foreground">₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {order.payment_method === "cod" ? "Cash on Delivery" : "Paid Online"}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
