import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import CascadingLocationSelector from '@/components/CascadingLocationSelector';
import { 
  Building2, Search, MapPin, Star, CheckCircle, 
  Grid3X3, List, ChevronLeft, SlidersHorizontal, User, LogOut, Map
} from 'lucide-react';

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  city: string;
  state: string;
  is_verified: boolean;
  is_premium: boolean;
  average_rating: number;
  total_reviews: number;
}

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'BEAUTY', label: 'Beauty' },
  { value: 'FITNESS', label: 'Fitness' },
  { value: 'HOME_SERVICES', label: 'Home Services' },
  { value: 'AUTOMOTIVE', label: 'Automotive' },
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'FINANCIAL', label: 'Financial' },
  { value: 'OTHER', label: 'Other' },
];

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A-Z' },
];

type BusinessCategory = 'RESTAURANT' | 'RETAIL' | 'HEALTHCARE' | 'BEAUTY' | 'FITNESS' | 
  'HOME_SERVICES' | 'AUTOMOTIVE' | 'PROFESSIONAL' | 'EDUCATION' | 'ENTERTAINMENT' | 
  'TECHNOLOGY' | 'REAL_ESTATE' | 'FINANCIAL' | 'OTHER';

export default function Discover() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    fetchBusinesses();
  }, [selectedCategory, sortBy, selectedCity, selectedState]);

  const fetchBusinesses = async () => {
    setLoading(true);
    
    let query = supabase
      .from('businesses')
      .select('*')
      .eq('is_active', true);

    if (selectedCategory && selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory as BusinessCategory);
    }

    if (selectedState) {
      query = query.ilike('state', `%${selectedState}%`);
    }

    if (selectedCity) {
      query = query.ilike('city', `%${selectedCity}%`);
    }

    // Sort by premium first, then by selected criteria
    switch (sortBy) {
      case 'rating':
        query = query.order('is_premium', { ascending: false }).order('average_rating', { ascending: false });
        break;
      case 'reviews':
        query = query.order('is_premium', { ascending: false }).order('total_reviews', { ascending: false });
        break;
      case 'newest':
        query = query.order('is_premium', { ascending: false }).order('created_at', { ascending: false });
        break;
      case 'name':
        query = query.order('is_premium', { ascending: false }).order('name', { ascending: true });
        break;
    }

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('Error fetching businesses:', error);
    } else {
      setAllBusinesses(data || []);
      setBusinesses(data || []);
    }
    
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter businesses client-side
    if (searchQuery) {
      const filtered = allBusinesses.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setBusinesses(filtered);
    } else {
      setBusinesses(allBusinesses);
    }
  };

  const getDefaultImage = (category: string) => {
    const images: Record<string, string> = {
      RESTAURANT: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      RETAIL: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      HEALTHCARE: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
      BEAUTY: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
      FITNESS: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
      HOME_SERVICES: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
      AUTOMOTIVE: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
      PROFESSIONAL: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      EDUCATION: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
      ENTERTAINMENT: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
      TECHNOLOGY: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      REAL_ESTATE: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      FINANCIAL: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    };
    return images[category] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground hidden sm:block">BizConnect</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/map">
                <Button variant="outline" size="sm">
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </Link>
              {user ? (
                <div className="flex items-center gap-2">
                  {profile?.role === 'BUSINESS_OWNER' && (
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm">Dashboard</Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="section-container py-8">
        {/* Search & Filters */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8 shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search businesses or services..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <CascadingLocationSelector
                  state={selectedState}
                  city={selectedCity}
                  onStateChange={setSelectedState}
                  onCityChange={setSelectedCity}
                  showLabels={false}
                  compact
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" size="lg" variant="gradient" className="h-12">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {selectedCategory === 'all' ? 'All Businesses' : categoryOptions.find(c => c.value === selectedCategory)?.label}
            </h1>
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${businesses.length} businesses found`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <Button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setSelectedCity(''); setSelectedState(''); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {businesses.map((business, index) => (
              <Link
                key={business.id}
                to={`/business/${business.slug || business.id}`}
                className={`group card-interactive overflow-hidden animate-slide-up ${viewMode === 'list' ? 'flex' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'}`}>
                  <img 
                    src={business.cover_image_url || getDefaultImage(business.category)} 
                    alt={business.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {business.is_premium && (
                      <Badge variant="premium">
                        <Star className="h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                    {business.is_verified && (
                      <Badge variant="verified">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {business.name}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {business.category.toLowerCase().replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md flex-shrink-0">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span className="font-medium text-sm">{Number(business.average_rating).toFixed(1)}</span>
                    </div>
                  </div>
                  {business.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {business.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {business.city}, {business.state}
                    </span>
                    <span>{business.total_reviews} reviews</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
