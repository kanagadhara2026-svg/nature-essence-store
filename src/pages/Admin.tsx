import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, LogOut, Home, Package, Image as ImageIcon, Upload } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import logo from "@/assets/logo.jpg";

type Product = Tables<"products">;

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

const allStatuses = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"];

const Admin = () => {
  const { user, isAdmin, loading, adminLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", category: "General", brand: "", price: "", original_price: "", rating: "5", is_new: false, is_active: true, image_url: "",
  });

  useEffect(() => {
    if (!loading && !adminLoading && (!user || !isAdmin)) navigate("/auth");
  }, [user, isAdmin, loading, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) { fetchProducts(); fetchOrders(); }
  }, [isAdmin]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  const resetForm = () => {
    setForm({ name: "", description: "", category: "General", brand: "", price: "", original_price: "", rating: "5", is_new: false, is_active: true, image_url: "" });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description || "", category: p.category, brand: (p as any).brand || "",
      price: String(p.price), original_price: p.original_price ? String(p.original_price) : "",
      rating: String(p.rating), is_new: p.is_new, is_active: p.is_active, image_url: p.image_url || "",
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) {
      toast({ title: "Upload Error", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(fileName);
    setForm({ ...form, image_url: publicUrl });
    setUploading(false);
    toast({ title: "Uploaded", description: "Image uploaded successfully" });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      toast({ title: "Error", description: "Name and price are required", variant: "destructive" });
      return;
    }
    const payload = {
      name: form.name.trim(), description: form.description.trim() || null, category: form.category.trim(),
      brand: form.brand.trim(), price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      rating: parseInt(form.rating), is_new: form.is_new, is_active: form.is_active,
      image_url: form.image_url.trim() || null,
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Updated", description: "Product updated" });
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Created", description: "Product created" });
    }
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchProducts(); }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const paymentStatus = status === "delivered" ? "paid" : undefined;
    const update: any = { status };
    if (paymentStatus) update.payment_status = paymentStatus;
    const { error } = await supabase.from("orders").update(update).eq("id", orderId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Updated" }); fetchOrders(); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Kanagadhara" className="h-9" />
          <h1 className="font-serif text-lg sm:text-xl font-semibold text-foreground">Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}><Home className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}><LogOut className="h-4 w-4" /></Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 flex gap-0">
          <button onClick={() => setTab("products")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "products" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <ImageIcon className="h-4 w-4 inline mr-1" /> Products
          </button>
          <button onClick={() => setTab("orders")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "orders" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <Package className="h-4 w-4 inline mr-1" /> Orders ({orders.length})
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-5xl">
        {tab === "products" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-semibold text-foreground">Products & Prices (₹)</h2>
              <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>

            {showForm && (
              <div className="card-3d rounded-2xl p-4 sm:p-6 mb-6">
                <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">{editing ? "Edit Product" : "New Product"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Name *</label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary border-border" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Brand</label>
                    <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="bg-secondary border-border" placeholder="e.g. Kanagadhara" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                    <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-secondary border-border" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Price (₹) *</label>
                    <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-secondary border-border" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">MRP (₹)</label>
                    <Input type="number" step="0.01" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} className="bg-secondary border-border" placeholder="Leave blank if no discount" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Rating (1-5)</label>
                    <Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="bg-secondary border-border" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                    <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-secondary border-border" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Product Image</label>
                    <div className="flex items-center gap-3">
                      {form.image_url && <img src={form.image_url} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />}
                      <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border cursor-pointer hover:border-primary transition-colors">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : "Upload Image"}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                      </label>
                      <span className="text-xs text-muted-foreground">or</span>
                      <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="bg-secondary border-border flex-1" placeholder="Paste URL" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} className="rounded" /> New
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" /> Active
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </div>
            )}

            {/* Products list */}
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="card-3d rounded-xl p-3 flex items-center gap-3">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-14 h-14 rounded-lg object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center"><ImageIcon className="h-5 w-5 text-muted-foreground" /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{(p as any).brand || p.category} · {p.is_active ? "Active" : "Inactive"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">₹{p.price.toLocaleString("en-IN")}</p>
                    {p.original_price && <p className="text-xs text-muted-foreground line-through">₹{p.original_price.toLocaleString("en-IN")}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(p)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p className="text-center text-muted-foreground py-8">No products yet.</p>}
            </div>
          </>
        )}

        {tab === "orders" && (
          <>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">All Orders</h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="card-3d rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-primary">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.delivery_name}</p>
                      <p className="text-xs text-muted-foreground">📞 {order.delivery_phone}</p>
                      <p className="text-xs text-muted-foreground">{order.delivery_city}, {order.delivery_state} — {order.delivery_pincode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-foreground">₹{Number(order.total_amount).toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{order.payment_method === "cod" ? "COD" : "Online"} · {order.payment_status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    <span className="text-xs text-muted-foreground mr-1">Status:</span>
                    {allStatuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(order.id, s)}
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full transition-all ${order.status === s ? statusColors[s] || "bg-muted text-muted-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                      >
                        {s.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-center text-muted-foreground py-8">No orders yet.</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
