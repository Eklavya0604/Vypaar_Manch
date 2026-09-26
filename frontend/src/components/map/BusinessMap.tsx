import { useEffect, useRef, useState } from 'react';
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
  const [isMapReady, setIsMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      
      // Fix default marker icon
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Custom icons
      const verifiedIcon = new L.default.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const premiumIcon = new L.default.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const userIcon = new L.default.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const map = L.default.map(mapContainerRef.current!).setView(
        [center.lat, center.lng],
        zoom
      );

      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // Add business markers
      const validBusinesses = businesses.filter(b => b.latitude && b.longitude);
      
      validBusinesses.forEach((business) => {
        let icon: any = new L.default.Icon.Default();
        if (business.is_premium) icon = premiumIcon;
        else if (business.is_verified) icon = verifiedIcon;

        const marker = L.default.marker([business.latitude, business.longitude], { icon }).addTo(map);
        
        const popupContent = `
          <div style="min-width: 200px; padding: 8px;">
            <h3 style="font-weight: 600; margin: 0 0 4px 0;">${business.name}</h3>
            <p style="font-size: 12px; color: #666; margin: 0 0 8px 0;">${business.category}</p>
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
              <span style="font-weight: 500;">★ ${business.average_rating || 'New'}</span>
              <span style="color: #666; font-size: 12px;">(${business.total_reviews || 0} reviews)</span>
            </div>
            <p style="font-size: 12px; color: #666; margin: 0 0 8px 0;">${business.city}</p>
            <a href="/business/${business.slug}" style="display: inline-block; padding: 6px 12px; background: #2563eb; color: white; border-radius: 4px; text-decoration: none; font-size: 12px;">View Details</a>
            ${business.contact_phone ? `<a href="tel:${business.contact_phone}" style="display: inline-block; margin-left: 4px; padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px; text-decoration: none; font-size: 12px;">📞</a>` : ''}
          </div>
        `;
        
        marker.bindPopup(popupContent);
      });

      // Fit bounds if there are businesses
      if (validBusinesses.length > 0) {
        const bounds = L.default.latLngBounds(
          validBusinesses.map(b => [b.latitude, b.longitude] as [number, number])
        );
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }

      // Try to get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userMarker = L.default.marker(
              [pos.coords.latitude, pos.coords.longitude],
              { icon: userIcon }
            ).addTo(map);
            userMarker.bindPopup('<strong>Your Location</strong>');
          },
          () => {} // Ignore errors
        );
      }

      mapInstanceRef.current = map;
      setIsMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [businesses, center, zoom]);

  return (
    <div className="rounded-lg overflow-hidden border border-border" style={{ height }}>
      <div ref={mapContainerRef} className="h-full w-full">
        {!isMapReady && (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
