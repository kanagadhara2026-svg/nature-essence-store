import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);

    const { error } = isLogin
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password);

    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (isLogin) {
      navigate("/admin");
    } else {
      toast({ title: "Success", description: "Check your email to confirm your account." });
    }
  };

  return (
    <div className="min-h-[100svh] flex items-center justify-center bg-background px-4 relative">
      {/* Background glows */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/8 blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-accent/8 blur-[100px]" />

      <div className="w-full max-w-sm relative">
        <div className="card-3d rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <img src={logo} alt="Kanagadhara" className="h-14 mx-auto mb-4" />
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              {isLogin ? "Admin Login" : "Create Account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin ? "Sign in to manage products" : "Create your admin account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
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
              {submitting ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
