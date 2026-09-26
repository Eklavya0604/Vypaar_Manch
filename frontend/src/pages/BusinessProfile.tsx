import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Building2, Star, MapPin, Phone, Mail, Globe, MessageCircle,
  ChevronLeft, CheckCircle, Clock, Calendar, Share2, Heart,
  Send, ExternalLink, Briefcase
} from 'lucide-react';
import { ReviewsSection } from '@/components/ReviewsSection';

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_link: string | null;
  website_url: string | null;
  portfolio_url: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string | null;
  operating_hours: unknown;
  is_verified: boolean;
  is_premium: boolean;
  average_rating: number;
  total_reviews: number;
  total_views: number;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price_min: number | null;
  price_max: number | null;
  duration_minutes: number | null;
  is_available: boolean;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  owner_response: string | null;
  created_at: string;
  consumer_id: string | null;
  is_verified?: boolean;
}

export default function BusinessProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [requestDescription, setRequestDescription] = useState('');
  const [requestPhone, setRequestPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBusiness();
    }
  }, [slug]);

  const fetchBusiness = async () => {
    setLoading(true);
    
    try {
      const { data } = await api.get(`/businesses/${slug}`);
      setBusiness(data);
      setServices(data.services || []);
      setReviews(data.reviews || []);

      // Record view
      await api.post(`/businesses/${data.id}/views`);
    } catch (error) {
      console.error(error);
      toast.error('Business not found');
      navigate('/discover');
    }

    setLoading(false);
  };

  const handleContactClick = async (type: 'CALL' | 'WHATSAPP' | 'EMAIL') => {
    if (!business) return;

    try {
      await api.post(`/businesses/${business.id}/contacts`);
    } catch (e) {
      console.error(e);
    }

    switch (type) {
      case 'CALL':
        window.location.href = `tel:${business.contact_phone}`;
        break;
      case 'WHATSAPP':
        window.open(business.whatsapp_link || `https://wa.me/${business.contact_phone?.replace(/\D/g, '')}`, '_blank');
        break;
      case 'EMAIL':
        window.location.href = `mailto:${business.contact_email}`;
        break;
    }
  };

  const handleServiceRequest = async () => {
    if (!business || !user || !profile) {
      toast.error('Please sign in to submit a request');
      navigate('/auth');
      return;
    }

    if (!requestDescription.trim()) {
      toast.error('Please describe your request');
      return;
    }

    try {
      await api.post(`/businesses/${business.id}/service-requests`, {
        serviceId: selectedService?.id || null,
        consumerId: profile.id,
        description: requestDescription,
        consumerPhone: requestPhone || profile.phone,
        consumerEmail: profile.email,
      });

      toast.success('Request submitted successfully!');
      setShowRequestForm(false);
      setRequestDescription('');
      setSelectedService(null);
    } catch (error) {
      toast.error('Failed to submit request');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const getDefaultImage = (category: string) => {
    const images: Record<string, string> = {
      RESTAURANT: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop',
      RETAIL: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
      HEALTHCARE: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop',
      BEAUTY: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=400&fit=crop',
      FITNESS: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop',
      HOME_SERVICES: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=400&fit=crop',
      TECHNOLOGY: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop',
    };
    return images[category] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-64 md:h-80">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="section-container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/discover" className="flex items-center gap-2">
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <Link to="/" className="flex items-center gap-2">
                <img src="/favicon.ico" alt="Vypar Manch Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
                <span className="text-xl font-bold text-foreground hidden sm:block">Vypar Manch</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <img 
          src={business.cover_image_url || getDefaultImage(business.category)} 
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="section-container -mt-20 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg animate-slide-up">
              <div className="flex items-start gap-4">
                {business.logo_url ? (
                  <img 
                    src={business.logo_url} 
                    alt={business.name}
                    className="w-20 h-20 rounded-xl object-cover border border-border"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                    <Building2 className="h-10 w-10 text-primary-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl font-bold text-foreground">{business.name}</h1>
                        {business.is_verified && (
                          <Badge variant="verified">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                        {business.is_premium && (
                          <Badge variant="premium">
                            <Star className="h-3 w-3" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground capitalize mt-1">
                        {business.category.toLowerCase().replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary px-3 py-2 rounded-lg">
                      <Star className="h-5 w-5 text-warning fill-warning" />
                      <span className="font-bold text-lg">{Number(business.average_rating).toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">({business.total_reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {[business.address_line1, business.city, business.state, business.pincode]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {business.description && (
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{business.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {services.length > 0 && (
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div 
                        key={service.id} 
                        className="p-4 bg-secondary/50 rounded-xl border border-border hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedService(service);
                          setShowRequestForm(true);
                        }}
                      >
                        <h4 className="font-semibold text-foreground">{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-sm">
                            {service.price_min && service.price_max ? (
                              <span className="font-medium text-primary">
                                ₹{service.price_min} - ₹{service.price_max}
                              </span>
                            ) : service.price_min ? (
                              <span className="font-medium text-primary">
                                From ₹{service.price_min}
                              </span>
                            ) : null}
                          </div>
                          {service.duration_minutes && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {service.duration_minutes} min
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <ReviewsSection
              businessId={business.id}
              reviews={reviews}
              averageRating={business.average_rating}
              totalReviews={business.total_reviews}
              onReviewSubmitted={fetchBusiness}
              canReview={!!profile}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24 animate-slide-up">
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.contact_phone && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleContactClick('CALL')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {business.contact_phone}
                  </Button>
                )}
                
                {(business.whatsapp_link || business.contact_phone) && (
                  <Button 
                    variant="success" 
                    className="w-full"
                    onClick={() => handleContactClick('WHATSAPP')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat on WhatsApp
                  </Button>
                )}

                {business.contact_email && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleContactClick('EMAIL')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {business.contact_email}
                  </Button>
                )}

                {business.website_url && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={business.website_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                )}

                {business.portfolio_url && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={business.portfolio_url} target="_blank" rel="noopener noreferrer">
                      <Briefcase className="h-4 w-4 mr-2" />
                      View Portfolio
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                )}

                <div className="pt-4 border-t">
                  <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
                    <DialogTrigger asChild>
                      <Button variant="gradient" className="w-full" size="lg">
                        <Send className="h-4 w-4 mr-2" />
                        Request Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Request Service</DialogTitle>
                        <DialogDescription>
                          Send a service request to {business.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {selectedService && (
                          <div className="p-3 bg-secondary rounded-lg">
                            <p className="text-sm font-medium">{selectedService.name}</p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="description">Describe your request *</Label>
                          <Textarea
                            id="description"
                            placeholder="Tell us what you need..."
                            value={requestDescription}
                            onChange={(e) => setRequestDescription(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="Your contact number"
                            value={requestPhone}
                            onChange={(e) => setRequestPhone(e.target.value)}
                          />
                        </div>
                        <Button 
                          variant="gradient" 
                          className="w-full" 
                          onClick={handleServiceRequest}
                          disabled={submitting}
                        >
                          {submitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
