import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import logo from "@/assets/logo.jpg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, user, isAdmin, loading, adminLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!loading && !adminLoading && user && isAdmin) {
    navigate("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);

    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome, Admin!" });
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-[100svh] flex items-center justify-center bg-background px-4 relative">
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-destructive/5 blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-primary/5 blur-[100px]" />

      <div className="w-full max-w-sm relative">
        <div className="card-3d rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <img src={logo} alt="Kanagadhara" className="h-14 mx-auto mb-4" />
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                Admin Login
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl bg-secondary border-border"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 rounded-xl bg-secondary border-border"
            />
            <Button type="submit" variant="hero" size="lg" className="w-full h-12" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In as Admin"}
            </Button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="w-full text-center text-xs text-muted-foreground mt-4 hover:text-foreground transition-colors"
          >
            ← Back to store
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
