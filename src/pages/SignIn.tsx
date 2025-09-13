import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, User, Shield, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { ValidationUtils } from "@/lib/validation";

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
  const [rateLimitError, setRateLimitError] = useState("");
  const { toast } = useToast();

  const redirectTo = searchParams.get('redirect') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    const criteria = [
      { test: /.{8,}/, message: "At least 8 characters" },
      { test: /[A-Z]/, message: "One uppercase letter" },
      { test: /[a-z]/, message: "One lowercase letter" },
      { test: /\d/, message: "One number" },
      { test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/, message: "One special character" }
    ];

    const passed = criteria.filter(criterion => criterion.test.test(password));
    const failed = criteria.filter(criterion => !criterion.test.test(password));

    return {
      score: passed.length,
      feedback: failed.map(f => f.message)
    };
  };

  // Enhanced password change handler
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (isSignUp && value) {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  // Enhanced error handling
  const getErrorMessage = (error: any) => {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (message.includes('email not confirmed')) {
      return 'Please check your email and click the verification link before signing in.';
    }
    if (message.includes('user not found')) {
      return 'No account found with this email address. Please sign up first.';
    }
    if (message.includes('weak password') || message.includes('password')) {
      return 'Password must be at least 6 characters long with a mix of letters and numbers.';
    }
    if (message.includes('email')) {
      return 'Please enter a valid email address.';
    }
    if (message.includes('rate limit')) {
      return 'Too many attempts. Please wait a moment before trying again.';
    }
    if (message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return error.message || 'An unexpected error occurred. Please try again.';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRateLimitError("");
    
    // Rate limiting check
    const rateLimitKey = `auth_${email}_${Date.now() - (Date.now() % 60000)}`; // Per minute window
    if (!ValidationUtils.checkRateLimit(rateLimitKey, 5, 60000)) {
      setRateLimitError("Too many attempts. Please wait a minute before trying again.");
      return;
    }

    // Enhanced validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!ValidationUtils.isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      
      if (passwordStrength.score < 3) {
        setError("Please choose a stronger password. " + passwordStrength.feedback.slice(0, 2).join(", "));
        return;
      }
    }

    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirectTo}`
          }
        });

        if (error) throw error;

        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
        
        // Switch to sign-in mode after successful signup
        setIsSignUp(false);
        setPassword("");
        setConfirmPassword("");
        setPasswordStrength({ score: 0, feedback: [] });
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });

        if (error) throw error;

        toast({
          title: "Sign in successful",
          description: "Welcome back to Nuvivo Health",
        });
        
        navigate(redirectTo);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      const enhancedError = getErrorMessage(error);
      setError(enhancedError);
      
      // Additional rate limiting for failed attempts
      const failedAttemptKey = `failed_${email}_${Date.now() - (Date.now() % 300000)}`; // 5 minute window
      ValidationUtils.checkRateLimit(failedAttemptKey, 3, 300000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      console.log('Starting Google OAuth with redirectTo:', `${window.location.origin}${redirectTo}`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      console.log('Google OAuth response:', { data, error });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }

      // OAuth redirect will happen automatically if successful
    } catch (error: any) {
      console.error('Google auth error:', error);
      setError(error.message || 'An error occurred with Google sign-in');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending reset email');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="border-border shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">
                  {isSignUp ? 'Join Nuvivo Health' : 'Patient Portal'}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {isSignUp 
                    ? 'Create your patient account to access all health services'
                    : 'Access your health records, book appointments, and manage your care'
                  }
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {rateLimitError && (
                <Alert variant="destructive">
                  <Shield className="w-4 h-4" />
                  <AlertDescription>{rateLimitError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="pl-10 pr-10 h-11"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {isSignUp && password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-200 ${
                              passwordStrength.score < 2 ? 'bg-destructive w-1/5' :
                              passwordStrength.score < 4 ? 'bg-yellow-500 w-3/5' :
                              'bg-green-500 w-full'
                            }`}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.score < 2 ? 'text-destructive' :
                          passwordStrength.score < 4 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {passwordStrength.score < 2 ? 'Weak' :
                           passwordStrength.score < 4 ? 'Good' :
                           'Strong'}
                        </span>
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Missing: {passwordStrength.feedback.slice(0, 2).join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-11"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (isSignUp ? "Creating account..." : "Signing in...") 
                    : (isSignUp ? "Create Patient Account" : "Access Patient Portal")
                  }
                </Button>
              </form>

              {!isSignUp && (
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={handleForgotPassword}
                    className="text-sm text-muted-foreground hover:text-primary"
                    disabled={isLoading}
                  >
                    Forgot your password?
                  </Button>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={handleGoogleSignIn}
                className="w-full h-11 text-base font-medium border-border hover:bg-accent"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="bg-accent/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {isSignUp ? "Already have a patient account?" : "New to Nuvivo Health?"}
                </p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:text-primary/80 font-medium"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                    setConfirmPassword("");
                  }}
                  disabled={isLoading}
                >
                  {isSignUp ? "Sign in to your account" : "Create a patient account"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignIn;