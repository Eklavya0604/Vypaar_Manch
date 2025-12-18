-- Create app_role enum with STAFF role
CREATE TYPE public.app_role AS ENUM ('CONSUMER', 'BUSINESS_OWNER', 'STAFF', 'ADMIN');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'CONSUMER',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role 
      WHEN 'ADMIN' THEN 1 
      WHEN 'BUSINESS_OWNER' THEN 2 
      WHEN 'STAFF' THEN 3 
      ELSE 4 
    END
  LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role on signup"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (has_role(auth.uid(), 'ADMIN'));

-- Add staff_assignments table for business owners to assign staff
CREATE TABLE public.staff_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    staff_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    assigned_by UUID REFERENCES auth.users(id) NOT NULL,
    permissions JSONB DEFAULT '{"can_view_requests": true, "can_update_requests": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (business_id, staff_user_id)
);

ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can manage staff"
ON public.staff_assignments
FOR ALL
USING (owns_business(auth.uid(), business_id));

CREATE POLICY "Staff can view their assignments"
ON public.staff_assignments
FOR SELECT
USING (staff_user_id = auth.uid());

-- Add favorites table for consumers
CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, business_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorites"
ON public.favorites
FOR ALL
USING (auth.uid() = user_id);

-- Add saved_searches table
CREATE TABLE public.saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    query JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved searches"
ON public.saved_searches
FOR ALL
USING (auth.uid() = user_id);

-- Add qr_code_url column to businesses
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

-- Create storage bucket for QR codes
INSERT INTO storage.buckets (id, name, public) VALUES ('qr-codes', 'qr-codes', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for business gallery
INSERT INTO storage.buckets (id, name, public) VALUES ('business-gallery', 'business-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for QR codes bucket
CREATE POLICY "QR codes are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'qr-codes');

CREATE POLICY "Business owners can upload QR codes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'qr-codes' AND auth.uid() IS NOT NULL);

-- Storage policies for business gallery
CREATE POLICY "Business gallery images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-gallery');

CREATE POLICY "Business owners can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'business-gallery' AND auth.uid() IS NOT NULL);

CREATE POLICY "Business owners can delete their gallery images"
ON storage.objects FOR DELETE
USING (bucket_id = 'business-gallery' AND auth.uid() IS NOT NULL);