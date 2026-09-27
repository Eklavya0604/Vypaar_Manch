import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, Plus, Eye, Phone, MessageSquare, Clock, 
  CheckCircle, AlertCircle, TrendingUp, Calendar,
  Star, ChevronRight, Bell, User, Settings, QrCode
} from 'lucide-react';
import { generateBusinessQRCode, downloadQRCode } from '@/utils/qrcode';
import { toast } from 'sonner';

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  is_verified: boolean;
  is_active: boolean;
  total_views: number;
  average_rating: number;
  total_reviews: number;
  qr_code_url: string | null;
}

interface DashboardStats {
  newRequests: number;
  activeJobs: number;
  completedJobs: number;
  totalViews: number;
  totalContacts: number;
}

interface ServiceRequest {
  id: string;
  description: string;
  status: string;
  created_at: string;
  preferred_date: string | null;
  consumer_email: string | null;
  businesses: { name: string } | null;
}

export default function OwnerHome() {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    newRequests: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalViews: 0,
    totalContacts: 0,
  });
  const [recentRequests, setRecentRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingQR, setGeneratingQR] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    if (!profile) return;
    setLoading(true);

    // Fetch owner's businesses
    const { data: businessData } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', profile.id);

    setBusinesses(businessData || []);

    if (businessData && businessData.length > 0) {
      const businessIds = businessData.map(b => b.id);

      // Fetch service requests
      const { data: requests } = await supabase
        .from('service_requests')
        .select('*, businesses(name)')
        .in('business_id', businessIds)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentRequests(requests || []);

      // Calculate stats
      const pending = requests?.filter(r => r.status === 'PENDING').length || 0;
      const active = requests?.filter(r => ['ACCEPTED', 'IN_PROGRESS'].includes(r.status)).length || 0;
      const completed = requests?.filter(r => r.status === 'COMPLETED').length || 0;

      // Fetch views
      const { count: viewCount } = await supabase
        .from('business_views')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds);

      // Fetch contacts
      const { count: contactCount } = await supabase
        .from('contact_logs')
        .select('*', { count: 'exact', head: true })
        .in('business_id', businessIds);

      setStats({
        newRequests: pending,
        activeJobs: active,
        completedJobs: completed,
        totalViews: viewCount || 0,
        totalContacts: contactCount || 0,
      });
    }

    setLoading(false);
  };

  const handleGenerateQR = async (business: Business) => {
    setGeneratingQR(business.id);
    const qrUrl = await generateBusinessQRCode(business.slug, business.id);
    if (qrUrl) {
      toast.success('QR code generated successfully!');
      fetchDashboardData();
    } else {
      toast.error('Failed to generate QR code');
    }
    setGeneratingQR(null);
  };

  const handleDownloadQR = async (business: Business) => {
    if (business.qr_code_url) {
      await downloadQRCode(business.qr_code_url, business.name);
      toast.success('QR code downloaded!');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'ACCEPTED':
        return <Badge variant="default">Accepted</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
              <Badge variant="outline" className="ml-2">Business</Badge>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Link to="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
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

      <div className="section-container py-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {(profile as any)?.fullName?.split(' ')[0] || profile?.full_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-muted-foreground">Here's what's happening with your businesses</p>
          </div>
          <Link to="/business/new">
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Business
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? '-' : stats.totalViews}
                </p>
                <p className="text-xs text-muted-foreground">Profile Views</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? '-' : stats.totalContacts}
                </p>
                <p className="text-xs text-muted-foreground">Contacts</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? '-' : stats.newRequests}
                </p>
                <p className="text-xs text-muted-foreground">New Requests</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? '-' : stats.activeJobs}
                </p>
                <p className="text-xs text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? '-' : stats.completedJobs}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Businesses List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Your Businesses</h2>

            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : businesses.length === 0 ? (
              <div className="p-8 rounded-xl bg-card border border-border text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No businesses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first business listing
                </p>
                <Link to="/business/new">
                  <Button variant="gradient">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Business
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {businesses.map((business) => (
                  <div
                    key={business.id}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{business.name}</h3>
                            {business.is_verified && (
                              <Badge variant="verified">Verified</Badge>
                            )}
                            {!business.is_active && (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{business.category}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {business.total_views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-warning fill-warning" />
                              {business.average_rating || 'New'}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {business.total_reviews} reviews
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {business.qr_code_url ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadQR(business)}
                            className="gap-1"
                          >
                            <QrCode className="h-4 w-4" />
                            Download QR
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateQR(business)}
                            disabled={generatingQR === business.id}
                            className="gap-1"
                          >
                            <QrCode className="h-4 w-4" />
                            {generatingQR === business.id ? 'Generating...' : 'Generate QR'}
                          </Button>
                        )}
                        <Link to={`/business/${business.slug}/edit`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        <Link to={`/business/${business.slug}`}>
                          <Button variant="gradient" size="sm">View</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Requests */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Service Requests</h2>

              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : recentRequests.length === 0 ? (
                <div className="p-6 rounded-xl bg-secondary/30 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No service requests yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRequests.slice(0, 5).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-card border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {request.description.slice(0, 50)}...
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.businesses?.name} • {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/business/new" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Business
                  </Button>
                </Link>

                <Link to="/calendar" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Calendar className="h-4 w-4" />
                    Manage Availability
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tips Card */}
            <div className="p-6 rounded-xl bg-gradient-primary text-primary-foreground">
              <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
              <p className="text-sm opacity-90">
                Generate a QR code for your business and display it at your shop. 
                Customers can scan it to view your services and book instantly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
