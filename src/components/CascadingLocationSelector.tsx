import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { getStates, getCitiesByState, findStateCodeByName, getStateName } from '@/data/indiaLocations';

interface CascadingLocationSelectorProps {
  state: string;
  city: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  required?: boolean;
  showLabels?: boolean;
  compact?: boolean;
  className?: string;
}

export default function CascadingLocationSelector({
  state,
  city,
  onStateChange,
  onCityChange,
  required = false,
  showLabels = true,
  compact = false,
  className = ''
}: CascadingLocationSelectorProps) {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);

  const states = getStates();

  // Initialize state code from state name
  useEffect(() => {
    if (state) {
      const code = findStateCodeByName(state);
      if (code) {
        setSelectedStateCode(code);
        setCities(getCitiesByState(code));
      }
    }
  }, [state]);

  const handleStateChange = (stateCode: string) => {
    setSelectedStateCode(stateCode);
    const stateName = getStateName(stateCode);
    onStateChange(stateName);
    
    // Reset city and load new cities
    const newCities = getCitiesByState(stateCode);
    setCities(newCities);
    onCityChange(''); // Reset city when state changes
  };

  const handleCityChange = (newCity: string) => {
    onCityChange(newCity);
  };

  if (compact) {
    return (
      <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        <div className="relative sm:flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <Select value={selectedStateCode} onValueChange={handleStateChange}>
            <SelectTrigger className="h-12 pl-10">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] bg-background">
              {states.map((s) => (
                <SelectItem key={s.code} value={s.code}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative sm:flex-1">
          <Select 
            value={city} 
            onValueChange={handleCityChange}
            disabled={!selectedStateCode}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder={selectedStateCode ? "Select City" : "Select state first"} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] bg-background">
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      <div className="space-y-2">
        {showLabels && (
          <Label htmlFor="state">
            State {required && '*'}
          </Label>
        )}
        <Select value={selectedStateCode} onValueChange={handleStateChange}>
          <SelectTrigger id="state">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-background">
            {states.map((s) => (
              <SelectItem key={s.code} value={s.code}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {showLabels && (
          <Label htmlFor="city">
            City {required && '*'}
          </Label>
        )}
        <Select 
          value={city} 
          onValueChange={handleCityChange}
          disabled={!selectedStateCode}
        >
          <SelectTrigger id="city">
            <SelectValue placeholder={selectedStateCode ? "Select City" : "Select state first"} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-background">
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
