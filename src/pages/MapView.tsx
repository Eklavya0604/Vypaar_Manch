import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Search, MapPin, ArrowLeft, Filter,
  Star, Navigation, X
} from 'lucide-react';
import BusinessMap from '@/components/map/BusinessMap';

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  latitude: number;
  longitude: number;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_premium: boolean;
  contact_phone: string | null;
}

const categories = [
  'All Categories',
  'Restaurant',
  'Retail',
  'Healthcare',
  'Beauty',
  'Fitness',
  'Home Services',
  'Automotive',
  'Professional',
  'Education',
  'Entertainment',
  'Technology',
  'Real Estate',
];

export default function MapView() {
  const { user, profile, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [radius, setRadius] = useState([10]); // km
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (error) => console.log('Geolocation not available')
      );
    }
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    
    let query = supabase
      .from('businesses')
      .select('*')
      .eq('is_active', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (category && category !== 'All Categories') {
      const categoryValue = category.toUpperCase().replace(' ', '_') as any;
      query = query.eq('category', categoryValue);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      console.error('Error fetching businesses:', error);
    } else {
      // Filter by radius if user location is available
      let filteredData = data || [];
      
      if (userLocation && radius[0] < 50) {
        filteredData = filteredData.filter((business) => {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            business.latitude,
            business.longitude
          );
          return distance <= radius[0];
        });
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (b) =>
            b.name.toLowerCase().includes(query) ||
            b.category.toLowerCase().includes(query) ||
            b.city.toLowerCase().includes(query)
        );
      }

      setBusinesses(filteredData);
    }
    
    setLoading(false);
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSearch = () => {
    fetchBusinesses();
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setTimeout(fetchBusinesses, 0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">Map View</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              {user ? (
                <Link to={profile?.role === 'BUSINESS_OWNER' ? '/owner' : '/consumer'}>
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="gradient" size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-card border-b border-border p-4 animate-fade-in">
          <div className="section-container">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-foreground mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search businesses..."
                    className="pl-9"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              <div className="w-48">
                <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-48">
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Radius: {radius[0]} km
                </label>
                <Slider
                  value={radius}
                  onValueChange={setRadius}
                  onValueCommit={fetchBusinesses}
                  min={1}
                  max={50}
                  step={1}
                />
              </div>

              <Button onClick={handleSearch} variant="gradient">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading businesses...</p>
            </div>
          </div>
        ) : (
          <BusinessMap
            businesses={businesses}
            center={userLocation || undefined}
            height="100%"
          />
        )}

        {/* Results Count Badge */}
        <div className="absolute top-4 left-4 z-[1000]">
          <Badge variant="secondary" className="shadow-lg">
            {businesses.length} businesses found
          </Badge>
        </div>

        {/* Center on User Button */}
        {userLocation && (
          <div className="absolute bottom-8 right-4 z-[1000]">
            <Button
              variant="secondary"
              size="icon"
              className="shadow-lg"
              onClick={() => {
                // This would require passing a ref to the map
              }}
            >
              <Navigation className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Business List (Collapsed) */}
      <div className="bg-card border-t border-border">
        <div className="section-container py-4">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {businesses.slice(0, 10).map((business) => (
              <Link
                key={business.id}
                to={`/business/${business.slug}`}
                className="flex-shrink-0 w-64 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm text-foreground truncate">{business.name}</h3>
                  {business.is_verified && (
                    <Badge variant="verified" className="text-[10px] px-1 py-0">✓</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 text-warning fill-warning" />
                  <span>{business.average_rating || 'New'}</span>
                  <span>•</span>
                  <span>{business.city}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
