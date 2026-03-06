import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpg";

const TrackOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [searching, setSearching] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      toast({ title: "Error", description: "Please enter Order ID and Phone Number", variant: "destructive" });
      return;
    }

    setSearching(true);
    try {
      // Search by order ID prefix (first 8 chars) and phone
      const { data, error } = await supabase
        .from("orders")
        .select("id, delivery_phone")
        .ilike("delivery_phone", `%${phone.trim()}%`);

      if (error) throw error;

      const match = data?.find(
        (o) => o.id.slice(0, 8).toUpperCase() === orderId.trim().toUpperCase().replace("#", "")
      );

      if (match) {
        navigate(`/order/${match.id}`);
      } else {
        toast({ title: "Not Found", description: "No order found with this ID and phone number", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-background">
      <header className="glass-strong border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img src={logo} alt="Kanagadhara" className="h-8" />
        <h1 className="font-serif text-lg font-semibold text-foreground">Track Order</h1>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-md">
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Track Your Order</h2>
          <p className="text-sm text-muted-foreground">Enter your Order ID and phone number to view order status</p>
        </div>

        <form onSubmit={handleTrack} className="card-3d rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Order ID *</label>
            <Input
              placeholder="e.g. A1B2C3D4"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="bg-secondary border-border rounded-xl h-11 uppercase font-mono"
              required
            />
            <p className="text-[10px] text-muted-foreground mt-1">The 8-character code shown after placing your order</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number *</label>
            <Input
              placeholder="Phone used while ordering"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-secondary border-border rounded-xl h-11"
              required
            />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full h-12" disabled={searching}>
            <Search className="h-4 w-4 mr-2" />
            {searching ? "Searching..." : "Track Order"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TrackOrder;
