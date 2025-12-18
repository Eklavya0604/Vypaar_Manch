-- Add portfolio_url column for freelancers to showcase their work
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS portfolio_url TEXT;