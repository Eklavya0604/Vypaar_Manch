import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import LocationPicker from '@/components/map/LocationPicker';
import ImageUpload from '@/components/ImageUpload';
import CascadingLocationSelector from '@/components/CascadingLocationSelector';
import { downloadQRCode, generateQRCodeDataUrl } from '@/utils/qrcode';
import { 
  Building2, ChevronLeft, MapPin, Phone, Mail, Globe, MessageCircle,
  Plus, Trash2, Save, QrCode, Download, Eye, Image, Link as LinkIcon, Briefcase
} from 'lucide-react';

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

interface Service {
  id: string;
  name: string;
  description: string | null;
  price_min: number | null;
  price_max: number | null;
  duration_minutes: number | null;
  is_active: boolean;
}

export default function EditBusiness() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({ name: '', description: '', price_min: '', price_max: '', duration_minutes: '' });
  
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
    is_active: true,
    slug: '',
    logo_url: null as string | null,
    cover_image_url: null as string | null,
  });

  useEffect(() => {
    if (id) {
      fetchBusiness();
      fetchServices();
    }
  }, [id]);

  const fetchBusiness = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching business:', error);
      toast.error('Business not found');
      navigate('/dashboard');
      return;
    }

    setFormData({
      name: data.name,
      category: data.category as BusinessCategory,
      description: data.description || '',
      contact_email: data.contact_email || '',
      contact_phone: data.contact_phone || '',
      whatsapp_link: data.whatsapp_link || '',
      website_url: data.website_url || '',
      portfolio_url: data.portfolio_url || '',
      address_line1: data.address_line1 || '',
      address_line2: data.address_line2 || '',
      city: data.city,
      state: data.state,
      pincode: data.pincode || '',
      latitude: data.latitude,
      longitude: data.longitude,
      is_active: data.is_active ?? true,
      slug: data.slug || '',
      logo_url: data.logo_url || null,
      cover_image_url: data.cover_image_url || null,
    });

    // Generate QR code
    if (data.slug) {
      const qrUrl = `${window.location.origin}/business/${data.slug}`;
      const qr = await generateQRCodeDataUrl(qrUrl);
      setQrCode(qr);
    }

    setLoading(false);
  };

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', id)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setServices(data);
    }
  };

  const handleChange = (field: string, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address?: string }) => {
    setFormData(prev => ({ ...prev, latitude: location.lat, longitude: location.lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !profile) {
      toast.error('Please sign in');
      return;
    }

    if (!formData.name.trim() || !formData.category || !formData.city.trim() || !formData.state.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('businesses')
      .update({
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
        is_active: formData.is_active,
        logo_url: formData.logo_url,
        cover_image_url: formData.cover_image_url,
      })
      .eq('id', id);

    setSaving(false);

    if (error) {
      console.error('Error updating business:', error);
      toast.error('Failed to update business');
    } else {
      toast.success('Business updated successfully!');
    }
  };

  const handleAddService = async () => {
    if (!newService.name.trim()) {
      toast.error('Service name is required');
      return;
    }

    const { error } = await supabase
      .from('services')
      .insert({
        business_id: id,
        name: newService.name.trim(),
        description: newService.description.trim() || null,
        price_min: newService.price_min ? parseFloat(newService.price_min) : null,
        price_max: newService.price_max ? parseFloat(newService.price_max) : null,
        duration_minutes: newService.duration_minutes ? parseInt(newService.duration_minutes) : null,
      });

    if (error) {
      toast.error('Failed to add service');
    } else {
      toast.success('Service added');
      setNewService({ name: '', description: '', price_min: '', price_max: '', duration_minutes: '' });
      fetchServices();
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) {
      toast.error('Failed to delete service');
    } else {
      toast.success('Service deleted');
      fetchServices();
    }
  };

  const handleDownloadQR = async () => {
    if (qrCode && formData.slug) {
      // Create download from data URL
      const a = document.createElement('a');
      a.href = qrCode;
      a.download = `${formData.slug}-qr-code.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="section-container py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-3">
              <Link to={`/business/${formData.slug || id}`} target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </Link>
              <Button variant="gradient" size="sm" onClick={handleSubmit} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="section-container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Business</h1>
          <p className="text-muted-foreground mt-2">Update your business information and services</p>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Business Images
                  </CardTitle>
                  <CardDescription>Upload your logo and cover banner to make your business stand out</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <ImageUpload
                      currentImage={formData.logo_url}
                      onUpload={(url) => handleChange('logo_url', url)}
                      onRemove={() => handleChange('logo_url', null)}
                      bucket="business-gallery"
                      folder={`logos/${id}`}
                      aspectRatio="square"
                      label="Business Logo"
                    />
                    <div className="md:col-span-1">
                      <ImageUpload
                        currentImage={formData.cover_image_url}
                        onUpload={(url) => handleChange('cover_image_url', url)}
                        onRemove={() => handleChange('cover_image_url', null)}
                        bucket="business-gallery"
                        folder={`banners/${id}`}
                        aspectRatio="banner"
                        label="Cover Banner"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Business Name *</Label>
                      <Input
                        id="name"
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is_active">Business is active and visible to customers</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={formData.contact_phone}
                          onChange={(e) => handleChange('contact_phone', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          value={formData.contact_email}
                          onChange={(e) => handleChange('contact_email', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp Link</Label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.whatsapp_link}
                        onChange={(e) => handleChange('whatsapp_link', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={formData.website_url}
                          onChange={(e) => handleChange('website_url', e.target.value)}
                          className="pl-10"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Portfolio / Work Samples Link</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={formData.portfolio_url}
                          onChange={(e) => handleChange('portfolio_url', e.target.value)}
                          className="pl-10"
                          placeholder="https://behance.net/yourwork"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        For freelancers: Add links to Behance, Dribbble, GitHub, or your portfolio site
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Address Line 1</Label>
                    <Input
                      value={formData.address_line1}
                      onChange={(e) => handleChange('address_line1', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address Line 2</Label>
                    <Input
                      value={formData.address_line2}
                      onChange={(e) => handleChange('address_line2', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <CascadingLocationSelector
                        state={formData.state}
                        city={formData.city}
                        onStateChange={(value) => handleChange('state', value)}
                        onCityChange={(value) => handleChange('city', value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pincode</Label>
                      <Input
                        value={formData.pincode}
                        onChange={(e) => handleChange('pincode', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
                <CardDescription>Add and manage services your business offers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Service */}
                <div className="p-4 bg-secondary/30 rounded-lg space-y-4">
                  <h4 className="font-medium">Add New Service</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Service Name *</Label>
                      <Input
                        placeholder="e.g., Haircut"
                        value={newService.name}
                        onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        placeholder="30"
                        value={newService.duration_minutes}
                        onChange={(e) => setNewService(prev => ({ ...prev, duration_minutes: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe the service..."
                      value={newService.description}
                      onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Min Price (₹)</Label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={newService.price_min}
                        onChange={(e) => setNewService(prev => ({ ...prev, price_min: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Price (₹)</Label>
                      <Input
                        type="number"
                        placeholder="500"
                        value={newService.price_max}
                        onChange={(e) => setNewService(prev => ({ ...prev, price_max: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddService}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>

                {/* Existing Services */}
                <div className="space-y-3">
                  {services.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No services added yet</p>
                  ) : (
                    services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          {service.description && (
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            {(service.price_min || service.price_max) && (
                              <span>
                                ₹{service.price_min || 0} - ₹{service.price_max || '∞'}
                              </span>
                            )}
                            {service.duration_minutes && (
                              <span>{service.duration_minutes} mins</span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Pin Your Location
                </CardTitle>
                <CardDescription>Click on the map to set your exact business location</CardDescription>
              </CardHeader>
              <CardContent>
                <LocationPicker
                  initialLocation={
                    formData.latitude && formData.longitude
                      ? { lat: formData.latitude, lng: formData.longitude }
                      : undefined
                  }
                  onLocationSelect={handleLocationSelect}
                />
                {formData.latitude && formData.longitude && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code
                </CardTitle>
                <CardDescription>
                  Download and print this QR code to display at your shop. Customers can scan it to view your business profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                {qrCode ? (
                  <>
                    <div className="p-6 bg-white rounded-xl shadow-lg">
                      <img src={qrCode} alt="Business QR Code" className="w-64 h-64" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Scan to visit: {window.location.origin}/business/{formData.slug}
                    </p>
                    <Button onClick={handleDownloadQR}>
                      <Download className="h-4 w-4 mr-2" />
                      Download QR Code
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground">QR code will be generated once the business has a slug</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}