import { useState, useEffect } from 'react';
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
    initialLocation || { lat: 19.0760, lng: 72.8777 } // Default to Mumbai
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [MapComponents, setMapComponents] = useState<React.ComponentType<any> | null>(null);

  // Dynamic import to avoid SSR/context issues with react-leaflet
  useEffect(() => {
    import('./MapComponents').then((mod) => {
      setMapComponents(() => mod.default);
    });
  }, []);

  const handlePositionChange = (newPos: { lat: number; lng: number }) => {
    setPosition(newPos);
    onLocationSelect(newPos);
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
        {MapComponents ? (
          <MapComponents
            mapCenter={mapCenter}
            position={position}
            onPositionChange={handlePositionChange}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
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
