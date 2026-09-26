import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Building2, ChevronLeft, MapPin, Phone, Mail, Globe, MessageCircle, Briefcase } from 'lucide-react';
import LocationPicker from '@/components/map/LocationPicker';
import CascadingLocationSelector from '@/components/CascadingLocationSelector';

const categoryOptions = [
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

type BusinessCategory = 'RESTAURANT' | 'RETAIL' | 'HEALTHCARE' | 'BEAUTY' | 'FITNESS' | 
  'HOME_SERVICES' | 'AUTOMOTIVE' | 'PROFESSIONAL' | 'EDUCATION' | 'ENTERTAINMENT' | 
  'TECHNOLOGY' | 'REAL_ESTATE' | 'FINANCIAL' | 'OTHER';

export default function CreateBusiness() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '' as BusinessCategory | '',
    description: '',
    contact_email: '',
    contact_phone: '',
    whatsapp_link: '',
    website_url: '',
    portfolio_url: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const handleLocationSelect = (location: { lat: number; lng: number; address?: string }) => {
    setFormData(prev => ({ ...prev, latitude: location.lat, longitude: location.lng }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !profile) {
      toast.error('Please sign in to create a business');
      navigate('/auth');
      return;
    }

    if (profile.role !== 'BUSINESS_OWNER') {
      toast.error('Only business owners can create listings');
      return;
    }

    if (!formData.name.trim() || !formData.category || !formData.city.trim() || !formData.state.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('businesses')
      .insert({
        owner_id: profile.id,
        name: formData.name.trim(),
        category: formData.category as BusinessCategory,
        description: formData.description.trim() || null,
        contact_email: formData.contact_email.trim() || null,
        contact_phone: formData.contact_phone.trim() || null,
        whatsapp_link: formData.whatsapp_link.trim() || null,
        website_url: formData.website_url.trim() || null,
        portfolio_url: formData.portfolio_url.trim() || null,
        address_line1: formData.address_line1.trim() || null,
        address_line2: formData.address_line2.trim() || null,
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim() || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

    setLoading(false);

    if (error) {
      console.error('Error creating business:', error);
      toast.error('Failed to create business');
    } else {
      toast.success('Business created successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2">
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <Link to="/" className="flex items-center gap-2">
                <img src="/favicon.ico" alt="Vypar Manch Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
                <span className="text-xl font-bold text-foreground">Vypar Manch</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="section-container py-8 max-w-3xl">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground">Create Your Business</h1>
          <p className="text-muted-foreground mt-2">Fill in the details to list your business on Vypar Manch</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell us about your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your business name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your business, services, and what makes you unique..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
              <CardDescription>Where is your business located?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input
                  id="address_line1"
                  placeholder="Street address, building name"
                  value={formData.address_line1}
                  onChange={(e) => handleChange('address_line1', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line2">Address Line 2</Label>
                <Input
                  id="address_line2"
                  placeholder="Floor, suite, landmark"
                  value={formData.address_line2}
                  onChange={(e) => handleChange('address_line2', e.target.value)}
                />
              </div>

              <CascadingLocationSelector
                state={formData.state}
                city={formData.city}
                onStateChange={(value) => handleChange('state', value)}
                onCityChange={(value) => handleChange('city', value)}
                required
              />

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                />
              </div>

              {/* Map Location Picker */}
              <div className="space-y-2">
                <Label>Pin Location on Map</Label>
                <p className="text-sm text-muted-foreground mb-2">Click on the map to set your exact business location</p>
                <LocationPicker onLocationSelect={handleLocationSelect} />
                {formData.latitude && formData.longitude && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>How can customers reach you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contact_phone"
                      placeholder="+91 98765 43210"
                      value={formData.contact_phone}
                      onChange={(e) => handleChange('contact_phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contact_email"
                      type="email"
                      placeholder="contact@business.com"
                      value={formData.contact_email}
                      onChange={(e) => handleChange('contact_email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_link">WhatsApp Link</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="whatsapp_link"
                    placeholder="https://wa.me/919876543210"
                    value={formData.whatsapp_link}
                    onChange={(e) => handleChange('whatsapp_link', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Format: https://wa.me/[country code][phone number]</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website_url">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website_url"
                      placeholder="https://www.yourbusiness.com"
                      value={formData.website_url}
                      onChange={(e) => handleChange('website_url', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio_url">Portfolio / Work Samples</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="portfolio_url"
                      placeholder="https://behance.net/yourwork"
                      value={formData.portfolio_url}
                      onChange={(e) => handleChange('portfolio_url', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">For freelancers: Add links to Behance, Dribbble, GitHub, etc.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="lg" disabled={loading}>
              {loading ? 'Creating...' : 'Create Business'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
