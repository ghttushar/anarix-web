import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccounts } from "@/contexts/AccountContext";
import { useTheme } from "@/contexts/ThemeContext";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import { useBranding } from "@/contexts/BrandingContext";
import legacyLogoFull from "@/assets/logo-light-full.svg";
import legacyLogoWhite from "@/assets/logo-dark-full.svg";
import newLogoFullLight from "@/assets/branding/anarix-full-light.svg";
import newLogoFullDark from "@/assets/branding/anarix-full-dark.svg";

export default function Login() {
  const navigate = useNavigate();
  const { clearAccounts } = useAccounts();
  const { resolvedTheme } = useTheme();
  const { newBranding } = useBranding();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Brand panel always uses the dark/white-on-color logo
  const brandPanelLogo = newBranding ? newLogoFullDark : legacyLogoWhite;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Clear any existing accounts for fresh demo experience
    clearAccounts();

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate to onboarding/connect accounts
    navigate("/onboarding/connect");
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* White logo for brand panel */}
          <img
            src={brandPanelLogo}
            alt="Anarix"
            className="h-12 w-auto mb-12 object-contain" />
          

          <h1 className="text-4xl font-heading font-bold mb-4 leading-tight">
            The intelligence layer
            <br />
            for your marketplace
          </h1>

          <p className="text-lg text-white/80 max-w-md">
            Unify your Amazon and Walmart advertising, automate optimization, and unlock
            insights that drive profitable growth.
          </p>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) =>
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-medium">
                
                  {String.fromCharCode(64 + i)}
                </div>
              )}
            </div>
            <p className="text-sm text-white/70">
              Join 2,000+ brands managing $500M+ in ad spend
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo - theme-aware */}
          <div className="lg:hidden mb-8">
            <AnarixLogo variant="full" className="h-10 w-auto" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
              Welcome back
            </h2>
            <p className="text-muted-foreground">Sign in to your Anarix account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required />
                
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 transition-colors">
                  
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button className="text-primary hover:text-primary/80 font-medium">
                Start a Free Trial
              </button>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              By signing in, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>);

}