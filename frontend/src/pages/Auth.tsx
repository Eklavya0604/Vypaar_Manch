import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Building2, User, Mail, Lock, ArrowRight, Sparkles, CheckCircle2, MapPin, Store, Star, Users, Eye } from 'lucide-react';
import { z } from 'zod';
import { useGoogleLogin } from '@react-oauth/google';

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
  const [showRoleSelection, setShowRoleSelection] = useState(true);

  useEffect(() => {
    if (user && !loading) {
      navigate('/consumer', { replace: true });
    }
  }, [user, loading, navigate]);

  const validateEmail = (email: string) => {
    const result = emailSchema.safeParse(email);
    return result.success;
  };

  const validatePassword = (password: string) => {
    const result = passwordSchema.safeParse(password);
    return result.success;
  };

  const { signIn, signUp, googleSignIn } = useAuth();

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
    
    const { error } = await signIn(email, password);
    
    setIsLoading(false);

    if (error) {
      toast.error(error.message || 'Failed to sign in');
    } else {
      toast.success('Welcome back!');
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
    
    const { error } = await signUp(email, password, fullName, selectedRole);

    if (error) {
      setIsLoading(false);
      toast.error(error.message || 'Failed to create account');
      return;
    }

    setIsLoading(false);
    toast.success('Account created! Welcome to Vypar Manch.');
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      // We pass the access token to our backend, which will verify it and sign in the user
      const { error } = await googleSignIn(tokenResponse.access_token, selectedRole || 'CONSUMER');
      
      setIsLoading(false);
      
      if (error) {
        toast.error(error.message || 'Failed to sign in with Google');
      } else {
        toast.success('Google Sign-In successful!');
      }
    },
    onError: () => {
      toast.error('Google Sign-In failed');
    }
  });

  const RoleSelectionStep = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-800">How will you use Vypar Manch?</h3>
        <p className="text-slate-500 text-sm">Choose your account type to get started</p>
      </div>
      
      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => setSelectedRole('CONSUMER')}
          className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
            selectedRole === 'CONSUMER'
              ? 'border-emerald-600 bg-emerald-50 shadow-md'
              : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${selectedRole === 'CONSUMER' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-800">Consumer</h4>
                {selectedRole === 'CONSUMER' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              </div>
              <p className="text-sm text-slate-500 mt-1">
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
              ? 'border-emerald-600 bg-emerald-50 shadow-md'
              : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${selectedRole === 'BUSINESS_OWNER' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-800">Business Owner</h4>
                {selectedRole === 'BUSINESS_OWNER' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              </div>
              <p className="text-sm text-slate-500 mt-1">
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
        className="w-full bg-[#185b45] hover:bg-[#124635] text-white h-12 text-lg rounded-xl"
      >
        Continue
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Vypar Manch...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Panel: Branding & Features (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-[#f6fbfa] relative overflow-hidden border-r border-slate-200">
        
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-20 flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-3">
            <img src="/favicon.ico" alt="Vypar Manch Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
            <span className="text-2xl font-extrabold text-[#113a2c]">Vypar Manch</span>
          </Link>
        </div>

        <div className="relative z-20 max-w-[420px] 2xl:max-w-[500px] mt-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#ebf5f1] text-[#185b45] text-[11px] font-bold tracking-[0.2em] uppercase mb-8">
            LOCAL • TRUSTED • GROW TOGETHER
          </div>
          
          <h1 className="text-[40px] 2xl:text-[44px] font-black text-[#113a2c] leading-[1.1] tracking-tight mb-5">
            Connect with <br />
            <span className="text-[#185b45]">Local Businesses</span>
          </h1>
          
          <p className="text-[16px] 2xl:text-[17px] text-slate-600 leading-[1.6] mb-12">
            Discover, connect and support businesses around you. From trusted shops to service providers, find everything you need — all in one place.
          </p>

          <div className="space-y-6 2xl:space-y-7">
            <div className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#ebf5f1] flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-[#185b45]" />
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-[#113a2c] text-base mb-1">Find Nearby Businesses</h3>
                <p className="text-slate-500 text-sm">Explore shops, services and professionals in your area</p>
              </div>
            </div>
            
            <div className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#ebf5f1] flex items-center justify-center shrink-0">
                <Store className="h-5 w-5 text-[#185b45]" />
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-[#113a2c] text-base mb-1">Support Local</h3>
                <p className="text-slate-500 text-sm">Help local businesses grow and thrive</p>
              </div>
            </div>
            
            <div className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#ebf5f1] flex items-center justify-center shrink-0">
                <Star className="h-5 w-5 text-[#185b45]" />
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-[#113a2c] text-base mb-1">Verified & Trusted</h3>
                <p className="text-slate-500 text-sm">Authentic listings and real reviews from the community</p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#ebf5f1] flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-[#185b45]" />
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-[#113a2c] text-base mb-1">Join the Community</h3>
                <p className="text-slate-500 text-sm">Be a part of a growing local network</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hand-drawn text at the bottom */}
        <div className="relative z-20 mt-10 ml-24 2xl:mt-12 2xl:ml-32">
          <div className="relative inline-block">
            <svg className="absolute -left-16 -top-12 w-16 h-16 text-[#185b45] opacity-60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 20 10 Q 20 70, 80 80 M 65 65 L 80 80 L 65 95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="text-[#185b45] font-serif italic text-xl opacity-80 leading-tight transform -rotate-3">
              Local Business<br />Stronger Communities
            </div>
          </div>
        </div>
        
        {/* Floating Decorative Cards on the Right */}
        <div className="absolute right-[-15%] xl:right-[-5%] 2xl:right-8 top-[50%] w-[400px] h-[700px] pointer-events-none z-10 hidden lg:block transform -translate-y-1/2 scale-[0.6] xl:scale-[0.8] 2xl:scale-100 origin-right">
          {/* Sparkles */}
          <div className="absolute top-10 left-10">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#185b45]">
              <path d="M20 0V15M20 40V25M0 20H15M40 20H25M7 7L14 14M33 33L26 26M7 33L14 26M33 7L26 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Card 1: Cafes */}
          <div className="absolute top-8 right-[-20px] transform rotate-[8deg] transition-transform hover:rotate-[4deg] duration-500 z-10">
            <div className="bg-white p-2.5 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative">
              <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80" alt="Cafe" className="w-[220px] h-[220px] object-cover rounded-2xl" />
              <div className="absolute -bottom-4 right-6 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-slate-100">
                <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8h1a4 4 0 110 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 2v2M10 2v2M14 2v2"/></svg>
                <span className="text-sm font-bold text-slate-800">Cafes</span>
              </div>
            </div>
          </div>

          {/* Card 2: Fashion */}
          <div className="absolute top-[260px] left-4 transform -rotate-[6deg] transition-transform hover:-rotate-[2deg] duration-500 z-20">
            <div className="bg-white p-2.5 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative">
              <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80" alt="Fashion" className="w-[200px] h-[200px] object-cover rounded-2xl" />
              <div className="absolute -bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-slate-100">
                <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
                <span className="text-sm font-bold text-slate-800">Fashion</span>
              </div>
            </div>
          </div>

          {/* Card 3: Services */}
          <div className="absolute bottom-[20px] right-[-10px] transform rotate-[4deg] transition-transform hover:rotate-0 duration-500 z-30">
            <div className="bg-white p-2.5 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative">
              <img src="https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=400&q=80" alt="Services" className="w-[240px] h-[180px] object-cover rounded-2xl" />
              <div className="absolute -bottom-4 left-6 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-slate-100">
                <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                <span className="text-sm font-bold text-slate-800">Services</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        <div className="absolute top-8 right-8 flex gap-6 text-sm font-semibold text-slate-600">
          <Link to="/discover" className="hover:text-[#185b45] transition-colors">Explore Businesses</Link>
          <Link to="/help" className="hover:text-[#185b45] transition-colors">Help</Link>
        </div>

        <div className="w-full max-w-md bg-white rounded-[2rem] p-8 lg:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 animate-slide-up">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
              Welcome to <span className="text-[#185b45]">Vypar Manch</span>
            </h2>
            <p className="text-slate-500 text-[15px]">
              Sign in to your account or create a new one to explore local businesses.
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="w-full h-auto grid grid-cols-2 bg-slate-50 p-1.5 rounded-2xl mb-8">
              <TabsTrigger 
                value="signin" 
                className="rounded-xl py-3 font-semibold text-slate-600 hover:text-[#185b45] data-[state=active]:bg-white data-[state=active]:text-[#185b45] data-[state=active]:shadow-sm transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-xl py-3 font-semibold text-slate-600 hover:text-[#185b45] data-[state=active]:bg-white data-[state=active]:text-[#185b45] data-[state=active]:shadow-sm transition-all"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            {/* Sign In Form */}
            <TabsContent value="signin" className="space-y-5 animate-fade-in">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-bold text-slate-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 rounded-xl bg-white border-slate-200 focus-visible:border-[#185b45] focus-visible:ring-[#185b45]/20"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-bold text-slate-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 rounded-xl bg-white border-slate-200 focus-visible:border-[#185b45] focus-visible:ring-[#185b45]/20"
                      required
                    />
                    <Eye className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 cursor-pointer" />
                  </div>
                  <div className="flex justify-end pt-1">
                    <a href="#" className="text-sm font-semibold text-[#185b45] hover:underline">Forgot password?</a>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#185b45] hover:bg-[#124635] text-white h-12 text-lg rounded-xl shadow-lg shadow-[#185b45]/20 mt-2" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs font-bold text-slate-400">
                  <span className="bg-white px-4">OR</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleGoogleSignIn()}
                  className="w-full h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold" 
                  disabled={isLoading}
                >
                  <img src="/SVG/google-logo-search-new-svgrepo-com.svg" alt="Google" className="h-5 w-5 mr-2" />
                  Continue with Google
                </Button>
              </div>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="signup" className="space-y-5 animate-fade-in">
              {showRoleSelection ? (
                <RoleSelectionStep />
              ) : (
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-bold text-slate-700">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-11 h-12 rounded-xl bg-white border-slate-200 focus-visible:border-[#185b45]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-bold text-slate-700">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 h-12 rounded-xl bg-white border-slate-200 focus-visible:border-[#185b45]"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-bold text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 h-12 rounded-xl bg-white border-slate-200 focus-visible:border-[#185b45]"
                        required
                      />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Must be at least 6 characters</p>
                  </div>

                  {selectedRole && (
                    <div className="p-4 bg-emerald-50 rounded-xl flex items-center justify-between border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {selectedRole === 'CONSUMER' ? (
                            <User className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Building2 className="h-5 w-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Account Type</p>
                          <span className="text-sm font-bold text-emerald-900">
                            {selectedRole === 'CONSUMER' ? 'Consumer' : 'Business Owner'}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRoleSelection(true)}
                        className="text-emerald-700 hover:bg-emerald-100 font-semibold"
                      >
                        Change
                      </Button>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-[#185b45] hover:bg-[#124635] text-white h-12 text-lg rounded-xl shadow-lg shadow-[#185b45]/20 mt-4" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : selectedRole ? 'Create Account' : 'Continue'}
                    {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs font-bold text-slate-400">
                      <span className="bg-white px-4">OR</span>
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleGoogleSignIn()}
                    className="w-full h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold" 
                    disabled={isLoading}
                  >
                    <img src="/SVG/google-logo-search-new-svgrepo-com.svg" alt="Google" className="h-5 w-5 mr-2" />
                    Sign up with Google
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center text-[13px] text-slate-500 font-medium">
            By continuing, you agree to our <a href="#" className="text-[#185b45] hover:underline">Terms of Service</a> and <a href="#" className="text-[#185b45] hover:underline">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
