import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react';

interface LocationPickerProps {
  initialLocation?: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
}

export default function LocationPicker({ initialLocation, onLocationSelect }: LocationPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    initialLocation || { lat: 19.0760, lng: 72.8777 }
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  // Initialize map on mount
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      
      leafletRef.current = L.default;
      
      // Fix default marker icon
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const map = L.default.map(mapContainerRef.current!).setView(
        [mapCenter.lat, mapCenter.lng],
        13
      );

      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      if (position) {
        markerRef.current = L.default.marker([position.lat, position.lng]).addTo(map);
      }

      map.on('click', (e: any) => {
        const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
        setPosition(newPos);
        onLocationSelect(newPos);
        
        if (markerRef.current) {
          markerRef.current.setLatLng([newPos.lat, newPos.lng]);
        } else {
          markerRef.current = L.default.marker([newPos.lat, newPos.lng]).addTo(map);
        }
      });

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
  }, []);

  // Update map view when center changes
  useEffect(() => {
    if (mapInstanceRef.current && isMapReady) {
      mapInstanceRef.current.setView([mapCenter.lat, mapCenter.lng], 15);
    }
  }, [mapCenter, isMapReady]);

  const updateMarker = (newPos: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    
    if (markerRef.current) {
      markerRef.current.setLatLng([newPos.lat, newPos.lng]);
    } else {
      markerRef.current = leafletRef.current.marker([newPos.lat, newPos.lng]).addTo(mapInstanceRef.current);
    }
    mapInstanceRef.current.setView([newPos.lat, newPos.lng], 15);
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(newPos);
          setMapCenter(newPos);
          onLocationSelect(newPos);
          updateMarker(newPos);
          setIsLocating(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setPosition(newPos);
        setMapCenter(newPos);
        onLocationSelect({ ...newPos, address: data[0].display_name });
        updateMarker(newPos);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for an address..."
            className="pl-9"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} variant="outline">
          Search
        </Button>
        <Button 
          onClick={handleUseCurrentLocation} 
          variant="outline"
          disabled={isLocating}
        >
          <Navigation className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="h-[300px] rounded-lg overflow-hidden border border-border">
        <div ref={mapContainerRef} className="h-full w-full">
          {!isMapReady && (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {position && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Selected: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Click on the map to select your business location, or use the search/current location buttons.
      </p>
    </div>
  );
}
