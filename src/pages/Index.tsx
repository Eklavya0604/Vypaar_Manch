import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CascadingLocationSelector from '@/components/CascadingLocationSelector';
import { 
  Building2, Search, MapPin, Star, ChevronRight, 
  Utensils, ShoppingBag, Heart, Scissors, Dumbbell, 
  Home, Car, Briefcase, GraduationCap, Gamepad2,
  Laptop, Building, CheckCircle, Shield, Zap, Users, ArrowRight, Sparkles
} from 'lucide-react';

const categories = [
  { name: 'Restaurant', icon: Utensils, color: 'from-orange-400 to-red-500' },
  { name: 'Retail', icon: ShoppingBag, color: 'from-blue-400 to-indigo-500' },
  { name: 'Healthcare', icon: Heart, color: 'from-rose-400 to-pink-500' },
  { name: 'Beauty', icon: Scissors, color: 'from-fuchsia-400 to-purple-500' },
  { name: 'Fitness', icon: Dumbbell, color: 'from-emerald-400 to-green-500' },
  { name: 'Home Services', icon: Home, color: 'from-amber-400 to-orange-500' },
  { name: 'Automotive', icon: Car, color: 'from-slate-400 to-gray-600' },
  { name: 'Professional', icon: Briefcase, color: 'from-indigo-400 to-blue-600' },
  { name: 'Education', icon: GraduationCap, color: 'from-purple-400 to-indigo-500' },
  { name: 'Entertainment', icon: Gamepad2, color: 'from-cyan-400 to-blue-500' },
  { name: 'Technology', icon: Laptop, color: 'from-teal-400 to-emerald-500' },
  { name: 'Real Estate', icon: Building, color: 'from-green-400 to-teal-500' },
];

const featuredBusinesses = [
  {
    id: '1',
    name: 'Sunrise Cafe & Bakery',
    category: 'Restaurant',
    rating: 4.8,
    reviews: 124,
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    isVerified: true,
    isPremium: true,
  },
  {
    id: '2',
    name: 'Elite Fitness Studio',
    category: 'Fitness',
    rating: 4.9,
    reviews: 89,
    city: 'Delhi',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    isVerified: true,
    isPremium: false,
  },
  {
    id: '3',
    name: 'TechPro Solutions',
    category: 'Technology',
    rating: 4.7,
    reviews: 56,
    city: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    isVerified: true,
    isPremium: true,
  },
];

const stats = [
  { value: '10K+', label: 'Businesses Listed' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '100+', label: 'Cities Covered' },
  { value: '4.8', label: 'Average Rating' },
];

export default function Index() {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedState) params.set('state', selectedState);
    if (selectedCity) params.set('city', selectedCity);
    navigate(`/discover?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-white/20 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-all duration-300">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className={`text-2xl font-extrabold tracking-tight transition-colors ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
                Vypar Manch
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/discover" className={`font-medium transition-colors hover:text-primary ${isScrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white/90 hover:text-white'}`}>
                Discover
              </Link>
              <Link to="/categories" className={`font-medium transition-colors hover:text-primary ${isScrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white/90 hover:text-white'}`}>
                Categories
              </Link>
              {profile?.role === 'BUSINESS_OWNER' && (
                <Link to="/dashboard" className={`font-medium transition-colors hover:text-primary ${isScrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white/90 hover:text-white'}`}>
                  Dashboard
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              {loading ? (
                <div className="w-24 h-10 bg-white/10 animate-pulse rounded-full" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile">
                    <Button variant="ghost" className={`rounded-full ${isScrolled ? '' : 'text-white hover:bg-white/10 hover:text-white'}`}>
                      {profile?.full_name || 'Profile'}
                    </Button>
                  </Link>
                  <Button variant="outline" className="rounded-full border-white/20 hover:bg-white/10" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/auth" className="hidden sm:block">
                    <Button variant="ghost" className={`rounded-full font-medium ${isScrolled ? '' : 'text-white hover:bg-white/10 hover:text-white'}`}>Log In</Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="rounded-full bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10 font-semibold px-6">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[90vh] flex items-center">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full mix-blend-screen filter blur-[120px] opacity-70 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl animate-fade-in hover:bg-white/10 transition-colors cursor-pointer">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-white/90">The #1 Platform for Indian Businesses</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight animate-slide-up">
              Connect with the best <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-primary">
                Local Businesses
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto font-light animate-slide-up stagger-1 leading-relaxed">
              Vypar Manch helps you find trusted services, read authentic reviews, and grow your local network.
            </p>

            {/* Premium Search Bar */}
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-3 rounded-3xl border border-white/20 shadow-2xl animate-slide-up stagger-2">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    placeholder="What are you looking for?" 
                    className="h-14 pl-14 bg-white/5 border-transparent text-white placeholder:text-slate-400 rounded-2xl focus:bg-white/10 transition-all text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="w-full md:w-1/3 bg-white/5 rounded-2xl px-2 flex items-center border border-transparent focus-within:border-white/10 transition-colors">
                  <CascadingLocationSelector
                    state={selectedState}
                    city={selectedCity}
                    onStateChange={setSelectedState}
                    onCityChange={setSelectedCity}
                    showLabels={false}
                    compact
                  />
                </div>
                <Button size="lg" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white font-semibold text-lg shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]" onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-12 animate-slide-up stagger-3 border-t border-white/10 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                  <div className="text-sm md:text-base font-medium text-slate-400 tracking-wide uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 -skew-y-2 origin-top-left scale-110 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Explore Categories</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400">Discover exactly what you need in your area.</p>
            </div>
            <Link to="/categories">
              <Button variant="ghost" className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
                View All Categories <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/discover?category=${category.name.toLowerCase().replace(' ', '_')}`}
                className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <category.icon className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-center">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Premium Businesses</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400">Handpicked, top-rated places just for you.</p>
            </div>
            <Link to="/discover">
              <Button variant="outline" className="rounded-full border-slate-200 dark:border-slate-700">
                Explore All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBusinesses.map((business, index) => (
              <Link
                key={business.id}
                to={`/business/${business.id}`}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={business.image} 
                    alt={business.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {business.isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg backdrop-blur-md">
                        <Star className="h-3 w-3 mr-1 fill-white" /> Premium
                      </Badge>
                    )}
                    {business.isVerified && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg backdrop-blur-md">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-0 hover:bg-white/30">
                      {business.category}
                    </Badge>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white font-semibold">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      {business.rating}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors mb-2">
                      {business.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                        {business.city}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary" />
                        {business.reviews} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Why Choose Vypar Manch?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">We provide the most reliable platform to connect customers with authentic local businesses.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Listings", desc: "Every business is thoroughly verified for authenticity to ensure you get the best quality service.", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: Star, title: "Trusted Reviews", desc: "Real reviews from real people. Make informed decisions based on genuine customer experiences.", color: "text-amber-500", bg: "bg-amber-500/10" },
              { icon: Zap, title: "Instant Connection", desc: "Connect directly via WhatsApp, call, or message instantly without any hidden fees.", color: "text-emerald-500", bg: "bg-emerald-500/10" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-xl hover:-translate-y-2 transition-transform duration-300 text-center group">
                <div className={`w-20 h-20 mx-auto rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-10 w-10 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-emerald-600" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
            Ready to grow your business?
          </h2>
          <p className="text-xl text-emerald-50 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Join thousands of businesses already using Vypar Manch to reach more customers and grow their revenue locally.
          </p>
          <Link to="/auth">
            <Button size="lg" className="h-16 px-10 rounded-full bg-white text-primary hover:bg-slate-50 font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all hover:scale-105">
              List Your Business For Free
              <ArrowRight className="h-6 w-6 ml-3" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-400 rounded-xl flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Vypar Manch</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm mb-6">
                The most trusted platform connecting local businesses with customers across India. Discover, connect, and grow.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">For Customers</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/discover" className="hover:text-primary transition-colors">Discover</Link></li>
                <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
                <li><Link to="/reviews" className="hover:text-primary transition-colors">Reviews</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">For Businesses</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/auth" className="hover:text-primary transition-colors">List Business</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/success-stories" className="hover:text-primary transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} Vypar Manch. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
