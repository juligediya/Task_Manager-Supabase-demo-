import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import {toast} from "sonner";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading } = useAuth();
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      toast.error(
         "Error",{
        description: error?.message || "Invalid credentials",
       
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-accent">
      <Card className="w-[400px] shadow-lg border-border">
        <CardHeader className="space-y-4 pb-2">
          <div className="mx-auto border w-20 h-20 rounded-full flex items-center justify-center mb-2 border-[2px]">
           <img src="/newlogo.svg" alt="Logo" className="h-12 w-12 dark:invert" />

          </div>
          <CardTitle className="text-center text-2xl font-bold text-foreground">
            Welcome Back
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Sign in to access your Employee Dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-ring"
                disabled={isSubmitting}
                required
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-ring pr-10"
                  disabled={isSubmitting}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
