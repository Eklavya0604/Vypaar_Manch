import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, Search, MapPin, Star, ChevronRight, 
  Heart, Bell, User, Utensils, ShoppingBag, Scissors, 
  Dumbbell, Home, Car, LayoutDashboard, Compass, Bookmark, 
  MessageSquare, Edit3, Settings, HelpCircle, CheckCircle2, Circle, Plus
} from 'lucide-react';
import { api } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

const categories = [
  { name: 'Restaurant', icon: Utensils, count: '8 places', color: 'text-orange-500 bg-orange-50' },
  { name: 'Retail', icon: ShoppingBag, count: '5 places', color: 'text-blue-500 bg-blue-50' },
  { name: 'Beauty', icon: Scissors, count: '4 places', color: 'text-pink-500 bg-pink-50' },
  { name: 'Fitness', icon: Dumbbell, count: '3 places', color: 'text-green-500 bg-green-50' },
  { name: 'Home Services', icon: Home, count: '2 places', color: 'text-amber-500 bg-amber-50' },
  { name: 'Automotive', icon: Car, count: '2 places', color: 'text-slate-500 bg-slate-50' },
];

export default function ConsumerHome() {
  const { user, profile, signOut, updateRole } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [myBusinesses, setMyBusinesses] = useState<any[]>([]);
  const [loadingBiz, setLoadingBiz] = useState(false);
  const [allBusinesses, setAllBusinesses] = useState<any[]>([]);
  const [loadingAllBiz, setLoadingAllBiz] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState({ reviews: 0, saved: 0, viewed: 0, helpful: 0 });

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingBiz(true);
      setLoadingAllBiz(true);
      try {
        const { data } = await api.get('/businesses');
        if (data) {
          // Sort by creation date descending
          const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setAllBusinesses(sorted.slice(0, 8));
          if (profile?.id) {
            setMyBusinesses(data.filter((b: any) => b.ownerId === profile.id));
            
            // Try to fetch real stats if tables exist
            const { count: reviewCount } = await supabase.from('Review').select('*', { count: 'exact', head: true }).eq('consumerId', profile.id);
            setStats(prev => ({ ...prev, reviews: reviewCount || 0 }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch businesses:', err);
      } finally {
        setLoadingBiz(false);
        setLoadingAllBiz(false);
      }
    };
    fetchAllData();
  }, [profile]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="h-16 bg-[#185b45] text-white flex items-center px-6 justify-between shrink-0 z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center font-bold text-white text-xs">VM</div>
            <span className="text-xl font-bold tracking-tight">Vypar Manch</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-emerald-50">
            <Link to="/discover" className="hover:text-white transition-colors">Discover</Link>
            <Link to="/map" className="hover:text-white transition-colors">Map View</Link>
            <button onClick={() => updateRole('BUSINESS_OWNER')} className="hover:text-white transition-colors">Become a Business Owner</button>
          </nav>
        </div>

        <div className="flex-1 max-w-2xl mx-8 hidden lg:flex">
          <div className="flex w-full bg-white rounded-md overflow-hidden p-1 gap-1">
            <div className="flex-1 flex items-center bg-white px-3 border-r">
              <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/discover?q=${searchQuery}&city=${locationQuery}`)}
                placeholder="Search for businesses or services..." 
                className="w-full h-8 outline-none text-slate-800 text-sm placeholder:text-slate-400" 
              />
            </div>
            <div className="w-48 flex items-center bg-white px-3">
              <MapPin className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/discover?q=${searchQuery}&city=${locationQuery}`)}
                placeholder="Ghaziabad, UP" 
                className="w-full h-8 outline-none text-slate-800 text-sm placeholder:text-slate-400" 
              />
            </div>
            <button 
              onClick={() => navigate(`/discover?q=${searchQuery}&city=${locationQuery}`)}
              className="bg-[#ff7a59] hover:bg-[#e0694a] text-white px-6 rounded text-sm font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="text-emerald-50 hover:text-white"><Heart className="h-5 w-5" /></button>
          <button className="text-emerald-50 hover:text-white relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#185b45]"></span>
          </button>
          <div 
            onClick={() => signOut()} 
            className="flex items-center gap-2 cursor-pointer bg-[#124635] py-1.5 px-2.5 rounded-full hover:bg-[#0d3427] transition-colors"
            title="Sign Out"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              {profile?.fullName?.charAt(0) || 'A'}
            </div>
            <ChevronRight className="h-4 w-4 text-emerald-100" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-white border-r flex flex-col p-4 shrink-0 overflow-y-auto hidden lg:flex">
          <nav className="space-y-1.5 flex-1 mt-4">
            <Link to="/discover" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg">
              <Compass className="h-5 w-5" /> Discover
            </Link>
            <Link to="/categories" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg">
              <Building2 className="h-5 w-5" /> Categories
            </Link>
            <Link to="/saved" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg">
              <Bookmark className="h-5 w-5" /> Saved
            </Link>
            <Link to="/messages" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg">
              <MessageSquare className="h-5 w-5" /> Messages
            </Link>
            <Link to="/reviews" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg">
              <Star className="h-5 w-5" /> Reviews
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-emerald-800 bg-emerald-50 rounded-lg">
              <User className="h-5 w-5" /> Profile
            </Link>

            <div className="pt-6">
              <Link to="/business/new" className="block w-full">
                <Button className="w-full bg-[#185b45] hover:bg-[#124635] text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> List Your Business
                </Button>
              </Link>
            </div>
          </nav>

          <div className="mt-8 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <h4 className="font-bold text-emerald-900 mb-2 leading-tight">Support Local<br/>Grow Together</h4>
            <p className="text-xs text-emerald-700 mb-4 leading-relaxed">Discover amazing businesses in your area and be a part of a stronger community.</p>
            <div className="w-full h-24 bg-emerald-100 rounded-lg overflow-hidden flex items-end justify-center pb-2 relative">
              <Building2 className="h-16 w-16 text-emerald-800 opacity-20 absolute -bottom-4" />
            </div>
          </div>
        </aside>

        {/* MAIN SCROLLABLE AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8">
            
            {/* CENTER CONTENT */}
            <div className="flex-1 space-y-8 min-w-0">
              
              {/* Profile Hero */}
              <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
                <div className="h-32 bg-slate-200 w-full relative">
                  <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="px-6 pb-6 relative">
                  <div className="absolute -top-12 border-4 border-white w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-4xl font-bold text-emerald-800 shadow-sm">
                    {profile?.fullName?.charAt(0) || 'A'}
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full border shadow flex items-center justify-center cursor-pointer hover:bg-slate-50">
                      <Edit3 className="h-3 w-3 text-slate-600" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start pt-14">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        {profile?.fullName || 'Aditya Kumar'} <Edit3 className="h-4 w-4 text-slate-400 cursor-pointer" />
                      </h1>
                      <p className="text-slate-500 text-sm mt-1">{profile?.email || 'aditya@example.com'}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-600 font-medium">
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Ghaziabad, UP</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Joined Sep 2025</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-4 max-w-lg leading-relaxed">
                        Exploring local businesses and supporting my community. Always looking for great places, services and local brands.
                      </p>
                    </div>
                    <Button variant="outline" className="hidden sm:flex gap-2">
                      <Edit3 className="h-4 w-4" /> Edit Profile
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="shadow-sm border border-slate-100">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><Star className="h-5 w-5" /></div>
                    <div><div className="text-xl font-bold text-slate-800">{stats.reviews}</div><div className="text-xs text-slate-500 font-medium">Reviews Given</div></div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border border-slate-100">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Bookmark className="h-5 w-5" /></div>
                    <div><div className="text-xl font-bold text-slate-800">{stats.saved}</div><div className="text-xs text-slate-500 font-medium">Saved Places</div></div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border border-slate-100">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Compass className="h-5 w-5" /></div>
                    <div><div className="text-xl font-bold text-slate-800">{stats.viewed}</div><div className="text-xs text-slate-500 font-medium">Businesses Viewed</div></div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border border-slate-100">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600"><CheckCircle2 className="h-5 w-5" /></div>
                    <div><div className="text-xl font-bold text-slate-800">{stats.helpful}</div><div className="text-xs text-slate-500 font-medium">Helpful Votes</div></div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <div className="border-b">
                <div className="flex gap-6 overflow-x-auto">
                  {['Overview', 'My Businesses', 'Saved', 'Reviews', 'Messages', 'Settings'].map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-semibold whitespace-nowrap px-1 border-b-2 transition-colors ${activeTab === tab ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-800'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'Overview' && (
                <>
                  <section>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-800">Recent Businesses</h3>
                      <Link to="/discover" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1">View All <ChevronRight className="h-4 w-4" /></Link>
                    </div>
                    {loadingAllBiz ? (
                      <div className="text-slate-500 text-sm">Loading businesses...</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {allBusinesses.map(biz => (
                          <Link to={`/business/${biz.slug}`} key={biz.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer shadow-sm block">
                            <div className="h-32 relative bg-slate-200">
                              {biz.coverImageUrl || biz.logoUrl ? (
                                <img src={biz.coverImageUrl || biz.logoUrl} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400"><Building2 className="h-10 w-10 opacity-20" /></div>
                              )}
                              <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white"><Heart className="h-3.5 w-3.5 text-slate-600" /></button>
                              <div className="absolute bottom-2 left-2"><Badge variant="secondary" className="bg-white/90 backdrop-blur text-xs text-slate-800 font-medium border-0">{biz.category}</Badge></div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-bold text-slate-800 text-sm truncate">{biz.name}</h4>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{biz.city}{biz.state ? `, ${biz.state}` : ''}</p>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> {biz.averageRating || 0} <span className="text-slate-400 font-normal text-xs">({biz.totalReviews || 0})</span>
                                </div>
                                {biz.isVerified && <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none px-1.5 py-0">Verified</Badge>}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </section>

                  <section>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-800">Categories</h3>
                      <Link to="/categories" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1">View All <ChevronRight className="h-4 w-4" /></Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      {categories.map(cat => {
                        const count = allBusinesses.filter(b => b.category === cat.name).length;
                        return (
                          <Link to={`/discover?category=${cat.name}`} key={cat.name} className="bg-white shadow-sm border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-slate-300 transition-colors cursor-pointer text-center group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${cat.color}`}>
                              <cat.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-800">{cat.name}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{count} places</div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                </>
              )}

              {activeTab === 'My Businesses' && (
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Your Managed Businesses</h3>
                    <Link to="/business/new" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"><Plus className="h-4 w-4" /> Add New</Link>
                  </div>
                  {loadingBiz ? (
                    <div className="text-slate-500 text-sm">Loading your businesses...</div>
                  ) : myBusinesses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {myBusinesses.map(biz => (
                        <div key={biz.id} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 items-center">
                          <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                            {biz.logoUrl || biz.coverImageUrl ? (
                              <img src={biz.logoUrl || biz.coverImageUrl} alt={biz.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400"><Building2 className="h-6 w-6 opacity-40" /></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 truncate">{biz.name}</h4>
                            <p className="text-xs text-slate-500 truncate">{biz.category}</p>
                            <Link to={`/business/${biz.slug}`}>
                              <Button variant="outline" size="sm" className="mt-2 h-7 text-xs px-3">Manage</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3"><Building2 className="h-6 w-6" /></div>
                      <h3 className="font-bold text-slate-800 mb-1">No businesses yet</h3>
                      <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">You haven't listed any businesses on Vypar Manch. Add your first business to get started.</p>
                      <Link to="/business/new"><Button className="bg-[#185b45] hover:bg-[#124635] text-white">List Your Business</Button></Link>
                    </div>
                  )}
                </section>
              )}

              {['Saved', 'Reviews', 'Messages', 'Settings'].includes(activeTab) && (
                 <section className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center">
                    <div className="text-slate-400 mb-2 flex justify-center"><LayoutDashboard className="h-8 w-8 opacity-50" /></div>
                    <h3 className="font-bold text-slate-800 mb-1">{activeTab}</h3>
                    <p className="text-sm text-slate-500">This section is currently under development. Check back soon!</p>
                 </section>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="w-full xl:w-[320px] shrink-0 space-y-6">
              
              {/* Account Type */}
              {/* My Businesses */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 px-1">My Businesses</h4>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col p-4 space-y-4">
                  {loadingBiz ? (
                    <div className="text-sm text-slate-500">Loading your businesses...</div>
                  ) : myBusinesses.length > 0 ? (
                    myBusinesses.map(biz => (
                      <div key={biz.id} className="flex items-center gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <div className="w-10 h-10 rounded-md bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                          <Building2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-slate-800 text-sm truncate">{biz.name}</h5>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5 uppercase tracking-wider">{biz.category}</p>
                        </div>
                        <Link to={/business/}>
                          <Button variant="outline" size="sm" className="h-7 text-xs px-3 rounded-full hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">View</Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      You haven't listed any businesses yet.
                    </div>
                  )}
                  
                  <Link to="/business/new" className="block w-full pt-2">
                    <Button variant="outline" className="w-full text-sm h-9 border-dashed border-2 hover:border-emerald-500 hover:text-emerald-700 transition-colors">
                      <Plus className="h-4 w-4 mr-2" /> Add a Business
                    </Button>
                  </Link>
                </div>
              </div>
              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 px-1">Quick Actions</h4>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col py-1">
                  <Link to="/business/new" className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-50 group">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      <Building2 className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" /> List a New Business
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                  </Link>
                  <Link to="/saved" className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-50 group">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      <Bookmark className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" /> View Saved Businesses
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                  </Link>
                  <Link to="/reviews" className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-50 group">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      <Star className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" /> Manage Reviews
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                  </Link>
                  <Link to="/settings" className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-50 group">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      <Settings className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" /> Account Settings
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                  </Link>
                  <Link to="/help" className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-50 group">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      <HelpCircle className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" /> Help & Support
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
