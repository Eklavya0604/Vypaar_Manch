import { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Lazy load map content to avoid SSR issues
const BusinessMapContent = lazy(() => import('./BusinessMapContent'));

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  latitude: number;
  longitude: number;
  city: string;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_premium: boolean;
  contact_phone?: string;
}

interface BusinessMapProps {
  businesses: Business[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

export default function BusinessMap({ 
  businesses, 
  center = { lat: 19.0760, lng: 72.8777 },
  zoom = 12,
  height = '400px'
}: BusinessMapProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-border" style={{ height }}>
      <Suspense fallback={
        <div className="h-full w-full flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }>
        <BusinessMapContent
          businesses={businesses}
          center={center}
          zoom={zoom}
        />
      </Suspense>
    </div>
  );
}
