import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Building2, User, Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type UserRole = 'CONSUMER' | 'BUSINESS_OWNER';

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      if (user && !loading) {
        // Fetch user profile to determine role
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profileData?.role === 'BUSINESS_OWNER') {
          navigate('/dashboard');
        } else {
          navigate('/discover');
        }
      }
    };
    
    checkRoleAndRedirect();
  }, [user, loading, navigate]);

  const validateEmail = (email: string) => {
    const result = emailSchema.safeParse(email);
    return result.success;
  };

  const validatePassword = (password: string) => {
    const result = passwordSchema.safeParse(password);
    return result.success;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setIsLoading(false);

    if (error) {
      toast.error(error.message || 'Failed to sign in');
    } else {
      toast.success('Welcome back!');
      // Fetch role and redirect accordingly
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileData?.role === 'BUSINESS_OWNER') {
        navigate('/dashboard');
      } else {
        navigate('/discover');
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setShowRoleSelection(true);
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setIsLoading(false);
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
      return;
    }

    // Create profile and role after signup
    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          email: email,
          full_name: fullName || null,
          role: selectedRole,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      // Insert into user_roles table for secure role management
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: selectedRole,
        });

      if (roleError) {
        console.error('Error creating user role:', roleError);
      }
    }

    setIsLoading(false);
    toast.success('Account created! Welcome to BizConnect.');
    
    // Role-based redirect
    if (selectedRole === 'BUSINESS_OWNER') {
      navigate('/dashboard');
    } else {
      navigate('/discover');
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    
    setIsLoading(false);

    if (error) {
      toast.error(error.message || 'Failed to send magic link');
    } else {
      setMagicLinkSent(true);
      toast.success('Check your email for the magic link!');
    }
  };

  const RoleSelectionStep = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">How will you use BizConnect?</h3>
        <p className="text-muted-foreground text-sm">Choose your account type to get started</p>
      </div>
      
      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => setSelectedRole('CONSUMER')}
          className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
            selectedRole === 'CONSUMER'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${selectedRole === 'CONSUMER' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Consumer</h4>
                {selectedRole === 'CONSUMER' && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Discover local businesses, book services, and leave reviews
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('BUSINESS_OWNER')}
          className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
            selectedRole === 'BUSINESS_OWNER'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${selectedRole === 'BUSINESS_OWNER' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Business Owner</h4>
                {selectedRole === 'BUSINESS_OWNER' && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                List your business, manage services, and connect with customers
              </p>
            </div>
          </div>
        </button>
      </div>

      <Button
        type="button"
        onClick={() => setShowRoleSelection(false)}
        disabled={!selectedRole}
        className="w-full"
        variant="gradient"
        size="lg"
      >
        Continue
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl animate-scale-in">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-semibold">Check your email</h2>
            <p className="text-muted-foreground">
              We've sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
            </p>
            <Button variant="outline" onClick={() => setMagicLinkSent(false)} className="mt-4">
              Use a different email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slide-up">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">BizConnect</span>
          </Link>
          <p className="text-muted-foreground">Connect with local businesses</p>
        </div>

        <Card className="shadow-xl animate-scale-in">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" variant="gradient" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <form onSubmit={handleMagicLink}>
                  <Button type="submit" variant="outline" className="w-full" disabled={isLoading || !email}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Send Magic Link
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                {showRoleSelection ? (
                  <RoleSelectionStep />
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                    </div>

                    {selectedRole && (
                      <div className="p-3 bg-secondary rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {selectedRole === 'CONSUMER' ? (
                            <User className="h-4 w-4 text-primary" />
                          ) : (
                            <Building2 className="h-4 w-4 text-primary" />
                          )}
                          <span className="text-sm font-medium">
                            {selectedRole === 'CONSUMER' ? 'Consumer' : 'Business Owner'}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowRoleSelection(true)}
                        >
                          Change
                        </Button>
                      </div>
                    )}

                    <Button type="submit" className="w-full" variant="gradient" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : selectedRole ? 'Create Account' : 'Continue'}
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
