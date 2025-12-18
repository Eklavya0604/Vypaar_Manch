-- BizConnect Business Listing Platform Schema
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

-- User roles enum
CREATE TYPE public.user_role AS ENUM ('CONSUMER', 'BUSINESS_OWNER', 'ADMIN');

-- Business category enum
CREATE TYPE public.business_category AS ENUM (
  'RESTAURANT', 'RETAIL', 'HEALTHCARE', 'BEAUTY', 'FITNESS', 
  'HOME_SERVICES', 'AUTOMOTIVE', 'PROFESSIONAL', 'EDUCATION', 
  'ENTERTAINMENT', 'TECHNOLOGY', 'REAL_ESTATE', 'FINANCIAL', 'OTHER'
);

-- Service request status enum
CREATE TYPE public.request_status AS ENUM (
  'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'EXPIRED'
);

-- Contact type enum
CREATE TYPE public.contact_type AS ENUM ('CALL', 'WHATSAPP', 'FORM', 'EMAIL');

-- Notification type enum
CREATE TYPE public.notification_type AS ENUM (
  'NEW_REQUEST', 'REQUEST_UPDATE', 'REQUEST_ACCEPTED', 'REQUEST_COMPLETED',
  'NEW_REVIEW', 'SYSTEM', 'REMINDER', 'PROMOTION'
);

-- =============================================
-- TABLES
-- =============================================

-- User Profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'CONSUMER',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category business_category NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  whatsapp_link TEXT,
  website_url TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  operating_hours JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_min DECIMAL(10, 2),
  price_max DECIMAL(10, 2),
  duration_minutes INTEGER,
  category TEXT,
  is_available BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Service Requests table
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  consumer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  status request_status DEFAULT 'PENDING' NOT NULL,
  description TEXT NOT NULL,
  preferred_date DATE,
  preferred_time_slot TEXT,
  location_notes TEXT,
  contact_consent BOOLEAN DEFAULT false,
  consumer_phone TEXT,
  consumer_email TEXT,
  owner_notes TEXT,
  accepted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  consumer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  service_request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  owner_response TEXT,
  owner_response_at TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Business Views tracking
CREATE TABLE public.business_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  visitor_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  visit_source TEXT,
  device_type TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Contact Logs
CREATE TABLE public.contact_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  consumer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  contact_type contact_type NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Audit Logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

CREATE INDEX idx_businesses_owner_id ON public.businesses(owner_id);
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_city ON public.businesses(city);
CREATE INDEX idx_businesses_state ON public.businesses(state);
CREATE INDEX idx_businesses_is_active ON public.businesses(is_active);
CREATE INDEX idx_businesses_is_verified ON public.businesses(is_verified);
CREATE INDEX idx_businesses_is_premium ON public.businesses(is_premium);
CREATE INDEX idx_businesses_slug ON public.businesses(slug);

CREATE INDEX idx_services_business_id ON public.services(business_id);
CREATE INDEX idx_services_is_available ON public.services(is_available);

CREATE INDEX idx_service_requests_business_id ON public.service_requests(business_id);
CREATE INDEX idx_service_requests_consumer_id ON public.service_requests(consumer_id);
CREATE INDEX idx_service_requests_status ON public.service_requests(status);

CREATE INDEX idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX idx_reviews_consumer_id ON public.reviews(consumer_id);

CREATE INDEX idx_business_views_business_id ON public.business_views(business_id);
CREATE INDEX idx_business_views_created_at ON public.business_views(created_at);

CREATE INDEX idx_contact_logs_business_id ON public.contact_logs(business_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate slug from business name
CREATE OR REPLACE FUNCTION public.generate_business_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;
  
  WHILE EXISTS (SELECT 1 FROM public.businesses WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update business rating stats
CREATE OR REPLACE FUNCTION public.update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.businesses
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating)::DECIMAL(3,2), 0)
      FROM public.reviews
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
      AND is_active = true
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
      AND is_active = true
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.business_id, OLD.business_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to increment business views
CREATE OR REPLACE FUNCTION public.increment_business_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.businesses
  SET total_views = total_views + 1
  WHERE id = NEW.business_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get user profile id from auth id
CREATE OR REPLACE FUNCTION public.get_profile_id_from_auth()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is business owner
CREATE OR REPLACE FUNCTION public.is_business_owner(_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = _user_id AND role = 'BUSINESS_OWNER'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = _user_id AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to check if user owns business
CREATE OR REPLACE FUNCTION public.owns_business(_user_id UUID, _business_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.businesses b
    JOIN public.user_profiles p ON b.owner_id = p.id
    WHERE p.user_id = _user_id AND b.id = _business_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =============================================
-- TRIGGERS
-- =============================================

-- Update timestamps triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Business slug generation
CREATE TRIGGER generate_business_slug_trigger
  BEFORE INSERT OR UPDATE OF name ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.generate_business_slug();

-- Update business rating on review changes
CREATE TRIGGER update_business_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_business_rating();

-- Increment business views
CREATE TRIGGER increment_business_views_trigger
  AFTER INSERT ON public.business_views
  FOR EACH ROW EXECUTE FUNCTION public.increment_business_views();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable"
  ON public.user_profiles FOR SELECT
  USING (is_active = true);

-- Businesses Policies
CREATE POLICY "Public businesses are viewable by everyone"
  ON public.businesses FOR SELECT
  USING (is_active = true);

CREATE POLICY "Business owners can create businesses"
  ON public.businesses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'BUSINESS_OWNER'
    )
    AND owner_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Business owners can update their own businesses"
  ON public.businesses FOR UPDATE
  USING (public.owns_business(auth.uid(), id));

CREATE POLICY "Business owners can delete their own businesses"
  ON public.businesses FOR DELETE
  USING (public.owns_business(auth.uid(), id));

-- Services Policies
CREATE POLICY "Public services are viewable"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Business owners can manage their services"
  ON public.services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      JOIN public.user_profiles p ON b.owner_id = p.id
      WHERE b.id = business_id AND p.user_id = auth.uid()
    )
  );

-- Service Requests Policies
CREATE POLICY "Consumers can view their own requests"
  ON public.service_requests FOR SELECT
  USING (
    consumer_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Business owners can view requests for their businesses"
  ON public.service_requests FOR SELECT
  USING (public.owns_business(auth.uid(), business_id));

CREATE POLICY "Authenticated users can create service requests"
  ON public.service_requests FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND consumer_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Consumers can update their own pending requests"
  ON public.service_requests FOR UPDATE
  USING (
    consumer_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
    AND status = 'PENDING'
  );

CREATE POLICY "Business owners can update requests for their businesses"
  ON public.service_requests FOR UPDATE
  USING (public.owns_business(auth.uid(), business_id));

-- Reviews Policies
CREATE POLICY "Public reviews are viewable"
  ON public.reviews FOR SELECT
  USING (is_active = true);

CREATE POLICY "Consumers can create reviews for completed services"
  ON public.reviews FOR INSERT
  WITH CHECK (
    consumer_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Consumers can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (
    consumer_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Business owners can respond to reviews"
  ON public.reviews FOR UPDATE
  USING (public.owns_business(auth.uid(), business_id));

-- Business Views Policies
CREATE POLICY "Anyone can record business views"
  ON public.business_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Business owners can view their business analytics"
  ON public.business_views FOR SELECT
  USING (public.owns_business(auth.uid(), business_id));

-- Contact Logs Policies
CREATE POLICY "Anyone can record contact logs"
  ON public.contact_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Business owners can view their contact logs"
  ON public.contact_logs FOR SELECT
  USING (public.owns_business(auth.uid(), business_id));

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (
    user_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (
    user_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Audit Logs Policies (only admins can view)
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

-- =============================================
-- ENABLE REALTIME
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;