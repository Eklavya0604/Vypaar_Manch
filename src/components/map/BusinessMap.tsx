import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker for verified businesses
const verifiedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const premiumIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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

function MapBoundsHandler({ businesses }: { businesses: Business[] }) {
  const map = useMap();

  useEffect(() => {
    if (businesses.length > 0) {
      const bounds = L.latLngBounds(
        businesses
          .filter(b => b.latitude && b.longitude)
          .map(b => [b.latitude, b.longitude])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [businesses, map]);

  return null;
}

export default function BusinessMap({ 
  businesses, 
  center = { lat: 19.0760, lng: 72.8777 },
  zoom = 12,
  height = '400px'
}: BusinessMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (error) => console.log('Geolocation not available')
      );
    }
  }, []);

  const getMarkerIcon = (business: Business) => {
    if (business.is_premium) return premiumIcon;
    if (business.is_verified) return verifiedIcon;
    return new L.Icon.Default();
  };

  const validBusinesses = businesses.filter(b => b.latitude && b.longitude);

  return (
    <div className="rounded-lg overflow-hidden border border-border" style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validBusinesses.length > 0 && <MapBoundsHandler businesses={validBusinesses} />}

        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {validBusinesses.map((business) => (
          <Marker
            key={business.id}
            position={[business.latitude, business.longitude]}
            icon={getMarkerIcon(business)}
          >
            <Popup>
              <div className="min-w-[200px] space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{business.name}</h3>
                    <p className="text-xs text-muted-foreground">{business.category}</p>
                  </div>
                  {(business.is_verified || business.is_premium) && (
                    <div className="flex gap-1">
                      {business.is_premium && (
                        <Badge variant="premium" className="text-[10px] px-1 py-0">Premium</Badge>
                      )}
                      {business.is_verified && (
                        <Badge variant="verified" className="text-[10px] px-1 py-0">Verified</Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-warning fill-warning" />
                    <span className="font-medium">{business.average_rating || 'New'}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({business.total_reviews || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{business.city}</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <Link to={`/business/${business.slug}`} className="flex-1">
                    <Button size="sm" variant="gradient" className="w-full text-xs">
                      View Details
                    </Button>
                  </Link>
                  {business.contact_phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`tel:${business.contact_phone}`, '_self')}
                      className="text-xs"
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
