import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Building2, Plus, Eye, Phone, Star, MessageSquare, Clock,
  CheckCircle, XCircle, TrendingUp, Calendar, Settings,
  ChevronRight, BarChart3, Users, AlertCircle
} from 'lucide-react';

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  is_verified: boolean;
  is_premium: boolean;
  is_active: boolean;
  average_rating: number;
  total_reviews: number;
  total_views: number;
}

interface ServiceRequest {
  id: string;
  description: string;
  status: string;
  created_at: string;
  consumer_phone: string | null;
  consumer_email: string | null;
  service_id: string | null;
  services?: { name: string } | null;
}

interface DashboardStats {
  totalViews: number;
  totalContacts: number;
  newRequests: number;
  activeJobs: number;
  completedJobs: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalContacts: 0,
    newRequests: 0,
    activeJobs: 0,
    completedJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'BUSINESS_OWNER')) {
      toast.error('Access denied. Business owners only.');
      navigate('/');
    }
  }, [user, profile, authLoading, navigate]);

  useEffect(() => {
    if (profile?.id) {
      fetchBusinesses();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedBusiness) {
      fetchBusinessData();
    }
  }, [selectedBusiness]);

  const fetchBusinesses = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', profile!.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching businesses:', error);
    } else {
      setBusinesses(data || []);
      if (data && data.length > 0) {
        setSelectedBusiness(data[0]);
      }
    }
    setLoading(false);
  };

  const fetchBusinessData = async () => {
    if (!selectedBusiness) return;

    // Fetch service requests
    const { data: requestsData } = await supabase
      .from('service_requests')
      .select('*, services(name)')
      .eq('business_id', selectedBusiness.id)
      .order('created_at', { ascending: false })
      .limit(20);

    setRequests(requestsData || []);

    // Calculate stats
    const newReqs = requestsData?.filter(r => r.status === 'PENDING').length || 0;
    const activeJobs = requestsData?.filter(r => ['ACCEPTED', 'IN_PROGRESS'].includes(r.status)).length || 0;
    const completedJobs = requestsData?.filter(r => r.status === 'COMPLETED').length || 0;

    // Fetch view count from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: viewsCount } = await supabase
      .from('business_views')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', selectedBusiness.id)
      .gte('created_at', thirtyDaysAgo.toISOString());

    const { count: contactsCount } = await supabase
      .from('contact_logs')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', selectedBusiness.id)
      .gte('created_at', thirtyDaysAgo.toISOString());

    setStats({
      totalViews: viewsCount || selectedBusiness.total_views,
      totalContacts: contactsCount || 0,
      newRequests: newReqs,
      activeJobs,
      completedJobs,
    });
  };

  const handleRequestAction = async (requestId: string, action: 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') => {
    const updates: Record<string, unknown> = { status: action };
    
    switch (action) {
      case 'ACCEPTED':
        updates.accepted_at = new Date().toISOString();
        break;
      case 'IN_PROGRESS':
        updates.started_at = new Date().toISOString();
        break;
      case 'COMPLETED':
        updates.completed_at = new Date().toISOString();
        break;
      case 'CANCELLED':
        updates.cancelled_at = new Date().toISOString();
        break;
    }

    const { error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', requestId);

    if (error) {
      toast.error('Failed to update request');
    } else {
      toast.success('Request updated');
      fetchBusinessData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-warning/10 text-warning';
      case 'ACCEPTED': return 'bg-verified/10 text-verified';
      case 'IN_PROGRESS': return 'bg-primary/10 text-primary';
      case 'COMPLETED': return 'bg-success/10 text-success';
      case 'CANCELLED': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="section-container py-8">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
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
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">BizConnect</span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">Dashboard</span>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/business/new">
                <Button variant="gradient" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="section-container py-8">
        {businesses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No businesses yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by creating your first business listing to reach more customers
            </p>
            <Link to="/business/new">
              <Button variant="gradient" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Business
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Business Selector */}
            {businesses.length > 1 && (
              <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
                {businesses.map((biz) => (
                  <button
                    key={biz.id}
                    onClick={() => setSelectedBusiness(biz)}
                    className={`px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
                      selectedBusiness?.id === biz.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border hover:border-primary/50'
                    }`}
                  >
                    {biz.name}
                  </button>
                ))}
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card className="animate-slide-up">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalViews}</p>
                      <p className="text-sm text-muted-foreground">Profile Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up stagger-1">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Phone className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalContacts}</p>
                      <p className="text-sm text-muted-foreground">Contacts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up stagger-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.newRequests}</p>
                      <p className="text-sm text-muted-foreground">New Requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up stagger-3">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-verified/10 rounded-lg">
                      <Clock className="h-5 w-5 text-verified" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.activeJobs}</p>
                      <p className="text-sm text-muted-foreground">Active Jobs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up stagger-4">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.completedJobs}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Requests List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Service Requests</CardTitle>
                      <Tabs defaultValue="all" className="w-auto">
                        <TabsList className="h-8">
                          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                          <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
                          <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {requests.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No service requests yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requests.map((request, index) => (
                          <div 
                            key={request.id}
                            className="p-4 bg-secondary/30 rounded-xl border border-border animate-slide-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={getStatusColor(request.status)}>
                                    {request.status.replace('_', ' ')}
                                  </Badge>
                                  {request.services?.name && (
                                    <span className="text-sm text-muted-foreground">
                                      {request.services.name}
                                    </span>
                                  )}
                                </div>
                                <p className="text-foreground line-clamp-2">{request.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(request.created_at).toLocaleDateString()}
                                  </span>
                                  {request.status !== 'PENDING' && request.consumer_phone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      {request.consumer_phone}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                {request.status === 'PENDING' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="success"
                                      onClick={() => handleRequestAction(request.id, 'ACCEPTED')}
                                    >
                                      Accept
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleRequestAction(request.id, 'CANCELLED')}
                                    >
                                      Decline
                                    </Button>
                                  </>
                                )}
                                {request.status === 'ACCEPTED' && (
                                  <Button 
                                    size="sm" 
                                    variant="default"
                                    onClick={() => handleRequestAction(request.id, 'IN_PROGRESS')}
                                  >
                                    Start Work
                                  </Button>
                                )}
                                {request.status === 'IN_PROGRESS' && (
                                  <Button 
                                    size="sm" 
                                    variant="success"
                                    onClick={() => handleRequestAction(request.id, 'COMPLETED')}
                                  >
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedBusiness && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <Badge variant={selectedBusiness.is_active ? 'success' : 'secondary'}>
                            {selectedBusiness.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Verification</span>
                          <Badge variant={selectedBusiness.is_verified ? 'verified' : 'outline'}>
                            {selectedBusiness.is_verified ? 'Verified' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-warning fill-warning" />
                            <span className="font-medium">{Number(selectedBusiness.average_rating).toFixed(1)}</span>
                            <span className="text-muted-foreground">({selectedBusiness.total_reviews})</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t space-y-2">
                          <Link to={`/business/${selectedBusiness.slug || selectedBusiness.id}`}>
                            <Button variant="outline" className="w-full justify-between">
                              View Public Profile
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/business/${selectedBusiness.id}/edit`}>
                            <Button variant="outline" className="w-full justify-between">
                              <Settings className="h-4 w-4 mr-2" />
                              Edit Business
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link to="/business/new">
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Business
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                      <Badge variant="secondary" className="ml-auto">Soon</Badge>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Star className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                      <Badge variant="premium" className="ml-auto">Pro</Badge>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
