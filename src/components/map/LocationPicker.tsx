import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Search } from 'lucide-react';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  initialLocation?: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
}

function LocationMarker({ 
  position, 
  setPosition 
}: { 
  position: { lat: number; lng: number } | null;
  setPosition: (pos: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position === null ? null : (
    <Marker position={[position.lat, position.lng]} />
  );
}

function MapController({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], 15);
  }, [center, map]);
  
  return null;
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
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={handlePositionChange} />
          <MapController center={mapCenter} />
        </MapContainer>
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
