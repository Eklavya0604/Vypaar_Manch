import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Search, MapPin, Star, ChevronRight, 
  Utensils, ShoppingBag, Heart, Scissors, Dumbbell, 
  Home, Car, Briefcase, GraduationCap, Gamepad2,
  Laptop, Building, Wallet, MoreHorizontal,
  CheckCircle, Shield, Zap, Users, ArrowRight
} from 'lucide-react';

const categories = [
  { name: 'Restaurant', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
  { name: 'Retail', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
  { name: 'Healthcare', icon: Heart, color: 'bg-red-100 text-red-600' },
  { name: 'Beauty', icon: Scissors, color: 'bg-pink-100 text-pink-600' },
  { name: 'Fitness', icon: Dumbbell, color: 'bg-green-100 text-green-600' },
  { name: 'Home Services', icon: Home, color: 'bg-amber-100 text-amber-600' },
  { name: 'Automotive', icon: Car, color: 'bg-slate-100 text-slate-600' },
  { name: 'Professional', icon: Briefcase, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Education', icon: GraduationCap, color: 'bg-purple-100 text-purple-600' },
  { name: 'Entertainment', icon: Gamepad2, color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Technology', icon: Laptop, color: 'bg-teal-100 text-teal-600' },
  { name: 'Real Estate', icon: Building, color: 'bg-emerald-100 text-emerald-600' },
];

const featuredBusinesses = [
  {
    id: '1',
    name: 'Sunrise Cafe & Bakery',
    category: 'Restaurant',
    rating: 4.8,
    reviews: 124,
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">BizConnect</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/discover" className="text-muted-foreground hover:text-foreground transition-colors">
                Discover
              </Link>
              <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </Link>
              {profile?.role === 'BUSINESS_OWNER' && (
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              {loading ? (
                <div className="w-20 h-9 bg-muted animate-pulse rounded-lg" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile">
                    <Button variant="ghost" size="sm">
                      {profile?.full_name || 'Profile'}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="gradient" size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="section-container relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 animate-fade-in">
              <Zap className="h-4 w-4 text-warning" />
              <span className="text-sm text-primary-foreground/90">Trusted by 50,000+ customers</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight animate-slide-up">
              Discover & Connect with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-accent">
                Local Businesses
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-slide-up stagger-1">
              Find the best services near you, read trusted reviews, and book appointments with confidence.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto animate-slide-up stagger-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for businesses or services..." 
                  className="h-12 pl-12 bg-background/95 border-0 shadow-lg"
                />
              </div>
              <div className="relative sm:w-48">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Location" 
                  className="h-12 pl-12 bg-background/95 border-0 shadow-lg"
                />
              </div>
              <Button size="lg" variant="accent" className="h-12 px-8">
                Search
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 animate-slide-up stagger-3">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Browse by Category</h2>
              <p className="text-muted-foreground mt-1">Find exactly what you're looking for</p>
            </div>
            <Link to="/categories">
              <Button variant="ghost" className="hidden sm:flex">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/discover?category=${category.name.toLowerCase().replace(' ', '_')}`}
                className="group p-4 rounded-xl bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-foreground text-sm">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="section-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Businesses</h2>
              <p className="text-muted-foreground mt-1">Top-rated and verified businesses</p>
            </div>
            <Link to="/discover">
              <Button variant="ghost">
                Explore All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses.map((business, index) => (
              <Link
                key={business.id}
                to={`/business/${business.id}`}
                className="group card-interactive overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={business.image} 
                    alt={business.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {business.isPremium && (
                      <Badge variant="premium">
                        <Star className="h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                    {business.isVerified && (
                      <Badge variant="verified">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {business.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{business.category}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span className="font-medium text-sm">{business.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {business.city}
                    </span>
                    <span>{business.reviews} reviews</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Why Choose BizConnect?</h2>
            <p className="text-muted-foreground mt-2">Trusted by thousands of businesses and customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 animate-slide-up">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Verified Businesses</h3>
              <p className="text-muted-foreground">All businesses are verified for authenticity and quality assurance</p>
            </div>

            <div className="text-center p-6 animate-slide-up stagger-1">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Trusted Reviews</h3>
              <p className="text-muted-foreground">Read genuine reviews from real customers before you book</p>
            </div>

            <div className="text-center p-6 animate-slide-up stagger-2">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Direct Connection</h3>
              <p className="text-muted-foreground">Connect directly with businesses via call, WhatsApp, or forms</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-primary">
        <div className="section-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join thousands of businesses already using BizConnect to reach more customers
          </p>
          <Link to="/auth">
            <Button size="xl" variant="accent">
              List Your Business Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-12">
        <div className="section-container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-background">BizConnect</span>
              </div>
              <p className="text-muted text-sm">
                Connecting businesses with customers since 2025
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-background mb-4">For Customers</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/discover" className="hover:text-background transition-colors">Discover</Link></li>
                <li><Link to="/categories" className="hover:text-background transition-colors">Categories</Link></li>
                <li><Link to="/reviews" className="hover:text-background transition-colors">Reviews</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-background mb-4">For Businesses</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/auth" className="hover:text-background transition-colors">List Your Business</Link></li>
                <li><Link to="/pricing" className="hover:text-background transition-colors">Pricing</Link></li>
                <li><Link to="/resources" className="hover:text-background transition-colors">Resources</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-background mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/about" className="hover:text-background transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-background transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-muted/20 mt-8 pt-8 text-center text-sm text-muted">
            © 2024 BizConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
