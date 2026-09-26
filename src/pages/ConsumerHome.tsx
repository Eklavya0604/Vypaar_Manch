import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, Search, MapPin, Star, ChevronRight, 
  Navigation, TrendingUp, Heart, Bell, User,
  Utensils, ShoppingBag, Scissors, Dumbbell, Home, Car
} from 'lucide-react';
import BusinessMap from '@/components/map/BusinessMap';

const categories = [
  { name: 'Restaurant', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
  { name: 'Retail', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
  { name: 'Beauty', icon: Scissors, color: 'bg-pink-100 text-pink-600' },
  { name: 'Fitness', icon: Dumbbell, color: 'bg-green-100 text-green-600' },
  { name: 'Home Services', icon: Home, color: 'bg-amber-100 text-amber-600' },
  { name: 'Automotive', icon: Car, color: 'bg-slate-100 text-slate-600' },
];

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_premium: boolean;
  logo_url: string | null;
  contact_phone: string | null;
}

export default function ConsumerHome() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [nearbyBusinesses, setNearbyBusinesses] = useState<Business[]>([]);
  const [trendingBusinesses, setTrendingBusinesses] = useState<Business[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [nearMeEnabled, setNearMeEnabled] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (nearMeEnabled && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (error) => console.error('Location error:', error)
      );
    }
  }, [nearMeEnabled]);

  const fetchBusinesses = async () => {
    setLoading(true);
    
    // Fetch trending/featured businesses
    const { data: trending } = await supabase
      .from('businesses')
      .select('*')
      .eq('is_active', true)
      .order('total_views', { ascending: false })
      .limit(6);

    // Fetch verified businesses
    const { data: verified } = await supabase
      .from('businesses')
      .select('*')
      .eq('is_active', true)
      .eq('is_verified', true)
      .order('average_rating', { ascending: false })
      .limit(10);

    setTrendingBusinesses(trending || []);
    setNearbyBusinesses(verified || []);
    setLoading(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (locationQuery) params.set('location', locationQuery);
    navigate(`/discover?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.ico" alt="Vypar Manch Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
              <span className="text-xl font-bold text-foreground">Vypar Manch</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/discover" className="text-muted-foreground hover:text-foreground transition-colors">
                Discover
              </Link>
              <Link to="/map" className="text-muted-foreground hover:text-foreground transition-colors">
                Map View
              </Link>
              <Link to="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
                <Heart className="h-5 w-5" />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {profile?.full_name || 'Profile'}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Search Section */}
      <section className="bg-gradient-hero py-12 lg:py-16">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-primary-foreground/80">
              Find the best services near you
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for businesses or services..." 
                  className="h-12 pl-12 bg-background/95 border-0 shadow-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="relative sm:w-48">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Location" 
                  className="h-12 pl-12 bg-background/95 border-0 shadow-lg"
                />
              </div>
              <Button size="lg" variant="accent" className="h-12 px-8" onClick={handleSearch}>
                Search
              </Button>
            </div>

            {/* Near Me Toggle */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant={nearMeEnabled ? 'gradient' : 'outline'}
                size="sm"
                onClick={() => setNearMeEnabled(!nearMeEnabled)}
                className="gap-2"
              >
                <Navigation className="h-4 w-4" />
                Near Me
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-8">
        <div className="section-container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Quick Categories</h2>
            <Link to="/categories">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/discover?category=${category.name.toLowerCase().replace(' ', '_')}`}
                className="flex flex-col items-center p-3 rounded-xl bg-card border border-border hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center mb-2`}>
                  <category.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-foreground text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Map View */}
      {nearbyBusinesses.length > 0 && (
        <section className="py-8 bg-secondary/30">
          <div className="section-container">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Nearby Businesses
              </h2>
              <Link to="/map">
                <Button variant="ghost" size="sm">
                  Full Map <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <BusinessMap 
              businesses={nearbyBusinesses.filter(b => b.latitude && b.longitude) as any}
              height="300px"
            />
          </div>
        </section>
      )}

      {/* Trending Services */}
      <section className="py-8">
        <div className="section-container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-warning" />
              Trending Now
            </h2>
            <Link to="/discover?sort=trending">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingBusinesses.slice(0, 6).map((business) => (
                <Link
                  key={business.id}
                  to={`/business/${business.slug}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    {business.logo_url ? (
                      <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground truncate">{business.name}</h3>
                      {business.is_verified && (
                        <Badge variant="verified" className="text-[10px] px-1 py-0">✓</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{business.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-warning fill-warning" />
                        <span className="text-xs font-medium">{business.average_rating || 'New'}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{business.city}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Verified Highlights */}
      <section className="py-8 bg-secondary/30">
        <div className="section-container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Verified Businesses</h2>
            <Link to="/discover?verified=true">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-64 h-40 rounded-xl flex-shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              {nearbyBusinesses.map((business) => (
                <Link
                  key={business.id}
                  to={`/business/${business.slug}`}
                  className="w-64 flex-shrink-0 rounded-xl bg-card border border-border overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="h-24 bg-gradient-primary flex items-center justify-center">
                    {business.logo_url ? (
                      <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="h-10 w-10 text-primary-foreground" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">{business.name}</h3>
                      {business.is_premium && (
                        <Badge variant="premium" className="text-[10px] px-1 py-0">⭐</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{business.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="h-3 w-3 text-warning fill-warning" />
                      <span className="text-sm font-medium">{business.average_rating || 'New'}</span>
                      <span className="text-xs text-muted-foreground">• {business.city}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
