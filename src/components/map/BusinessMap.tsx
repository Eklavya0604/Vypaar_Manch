import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
  const [MapContent, setMapContent] = useState<React.ComponentType<any> | null>(null);

  // Dynamic import to avoid SSR/context issues with react-leaflet
  useEffect(() => {
    import('./BusinessMapContent').then((mod) => {
      setMapContent(() => mod.default);
    });
  }, []);

  return (
    <div className="rounded-lg overflow-hidden border border-border" style={{ height }}>
      {MapContent ? (
        <MapContent
          businesses={businesses}
          center={center}
          zoom={zoom}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
