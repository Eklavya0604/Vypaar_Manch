import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Building2, ChevronLeft, MapPin, Phone, Mail, Globe, MessageCircle, Briefcase, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import LocationPicker from '@/components/map/LocationPicker';
import CascadingLocationSelector from '@/components/CascadingLocationSelector';
import { ImageUpload } from '@/components/ui/ImageUpload';

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
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.name.trim()) {
        toast.error('Business name is required');
        return false;
      }
      if (!formData.category) {
        toast.error('Category is required');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.state.trim() || !formData.city.trim()) {
        toast.error('State and City are required');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!user || !profile) {
      toast.error('Please sign in to create a business');
      navigate('/auth');
      return;
    }

    if (profile.role !== 'BUSINESS_OWNER') {
      toast.error('Only business owners can create listings');
      return;
    }

    if (!validateStep(3)) return;

    setLoading(true);

    try {
      await api.post('/businesses', {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim() || null,
        contactEmail: formData.contact_email.trim() || null,
        contactPhone: formData.contact_phone.trim() || null,
        whatsappLink: formData.whatsapp_link.trim() || null,
        websiteUrl: formData.website_url.trim() || null,
        portfolioUrl: formData.portfolio_url.trim() || null,
        addressLine1: formData.address_line1.trim() || null,
        addressLine2: formData.address_line2.trim() || null,
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim() || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        logoUrl: (formData as any).logoUrl?.trim() || null,
        coverImageUrl: (formData as any).bannerUrl?.trim() || null,
      });

      toast.success('Business created successfully!');
      navigate('/consumer');
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error('Failed to create business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="h-16 bg-[#185b45] text-white flex items-center px-6 justify-between shrink-0 z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/consumer" className="flex items-center justify-center w-8 h-8 rounded-full bg-[#124635] hover:bg-[#0d3427] transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div className="h-4 w-px bg-[#124635]"></div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center font-bold text-white text-xs">VM</div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline">Vypar Manch</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto py-10 px-4">
        <div className="max-w-2xl mx-auto">
          
          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-slate-900">List Your Business</h1>
              <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            
            <div className="relative flex justify-between w-full">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300 ease-in-out" 
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
              </div>
              
              {[1, 2, 3].map((step) => (
                <div key={step} className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                  currentStep === step 
                    ? 'border-emerald-600 bg-white text-emerald-600' 
                    : currentStep > step 
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-slate-200 bg-white text-slate-400'
                }`}>
                  {currentStep > step ? <CheckCircle2 className="h-4 w-4" /> : step}
                </div>
              ))}
            </div>
          </div>

          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-emerald-600" /> Basic Information
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Tell us about what you do.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-semibold">Business Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. The Daily Brew"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="h-11 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-slate-700 font-semibold">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20">
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
                    <Label htmlFor="description" className="text-slate-700 font-semibold">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your services and what makes you unique..."
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                      className="bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 resize-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 pt-2">
                    <ImageUpload 
                      label="Logo (Optional)" 
                      value={(formData as any).logoUrl || null} 
                      onChange={(url) => handleChange('logoUrl', url)} 
                    />
                    <ImageUpload 
                      label="Banner Image (Optional)" 
                      value={(formData as any).bannerUrl || null} 
                      onChange={(url) => handleChange('bannerUrl', url)} 
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Location */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-emerald-600" /> Location Details
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Where can customers find you?</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line1" className="text-slate-700 font-semibold">Address Line 1</Label>
                    <Input
                      id="address_line1"
                      placeholder="Street address, building name"
                      value={formData.address_line1}
                      onChange={(e) => handleChange('address_line1', e.target.value)}
                      className="h-11 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line2" className="text-slate-700 font-semibold">Address Line 2</Label>
                    <Input
                      id="address_line2"
                      placeholder="Floor, suite, landmark (optional)"
                      value={formData.address_line2}
                      onChange={(e) => handleChange('address_line2', e.target.value)}
                      className="h-11 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="pt-2">
                    <CascadingLocationSelector
                      state={formData.state}
                      city={formData.city}
                      onStateChange={(value) => handleChange('state', value)}
                      onCityChange={(value) => handleChange('city', value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-slate-700 font-semibold">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="e.g. 201014"
                      value={formData.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                      className="h-11 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div>
                      <Label className="text-slate-700 font-semibold">Map Location</Label>
                      <p className="text-xs text-slate-500 mb-3">Pinpoint your exact location for the map view.</p>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <LocationPicker onLocationSelect={handleLocationSelect} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-emerald-600" /> Contact & Links
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">How can customers reach out or learn more?</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone" className="text-slate-700 font-semibold">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="contact_phone"
                          placeholder="+91 98765 43210"
                          value={formData.contact_phone}
                          onChange={(e) => handleChange('contact_phone', e.target.value)}
                          className="h-11 pl-10 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_email" className="text-slate-700 font-semibold">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="contact_email"
                          type="email"
                          placeholder="hello@business.com"
                          value={formData.contact_email}
                          onChange={(e) => handleChange('contact_email', e.target.value)}
                          className="h-11 pl-10 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="whatsapp_link" className="text-slate-700 font-semibold">WhatsApp Link</Label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="whatsapp_link"
                        placeholder="https://wa.me/919876543210"
                        value={formData.whatsapp_link}
                        onChange={(e) => handleChange('whatsapp_link', e.target.value)}
                        className="h-11 pl-10 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="website_url" className="text-slate-700 font-semibold">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="website_url"
                          placeholder="https://yourwebsite.com"
                          value={formData.website_url}
                          onChange={(e) => handleChange('website_url', e.target.value)}
                          className="h-11 pl-10 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolio_url" className="text-slate-700 font-semibold">Portfolio / Social</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="portfolio_url"
                          placeholder="Instagram, Behance, etc."
                          value={formData.portfolio_url}
                          onChange={(e) => handleChange('portfolio_url', e.target.value)}
                          className="h-11 pl-10 bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </CardContent>
            
            {/* Form Footer / Navigation */}
            <div className="bg-slate-50 border-t p-6 flex items-center justify-between">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  className="bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => navigate('/consumer')}
                  className="text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </Button>
              )}

              {currentStep < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="bg-[#185b45] hover:bg-[#124635] text-white px-8"
                >
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={() => handleSubmit()}
                  disabled={loading}
                  className="bg-[#ff7a59] hover:bg-[#e0694a] text-white px-8 shadow-sm"
                >
                  {loading ? 'Creating...' : 'Submit Business'}
                </Button>
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
