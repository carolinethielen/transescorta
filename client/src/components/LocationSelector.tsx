import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Navigation, Search } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string, coordinates?: { lat: number; lon: number }) => void;
}

export function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const { coordinates, isLoading: gpsLoading, getCurrentLocation } = useGeolocation();

  // Major German cities
  const majorCities = [
    { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
    { name: 'Hamburg', lat: 53.5511, lon: 9.9937 },
    { name: 'München', lat: 48.1351, lon: 11.5820 },
    { name: 'Köln', lat: 50.9375, lon: 6.9603 },
    { name: 'Frankfurt am Main', lat: 50.1109, lon: 8.6821 },
    { name: 'Stuttgart', lat: 48.7758, lon: 9.1829 },
    { name: 'Düsseldorf', lat: 51.2277, lon: 6.7735 },
    { name: 'Leipzig', lat: 51.3397, lon: 12.3731 },
    { name: 'Dortmund', lat: 51.5136, lon: 7.4653 },
    { name: 'Essen', lat: 51.4556, lon: 7.0116 },
    { name: 'Bremen', lat: 53.0793, lon: 8.8017 },
    { name: 'Dresden', lat: 51.0504, lon: 13.7373 },
    { name: 'Hannover', lat: 52.3759, lon: 9.7320 },
    { name: 'Nürnberg', lat: 49.4521, lon: 11.0767 },
    { name: 'Duisburg', lat: 51.4344, lon: 6.7623 },
  ];

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
    // Pass a special flag to indicate GPS location is being used
    onLocationChange('Aktuellen Standort verwenden');
    setIsOpen(false);
  };

  const handleCitySelect = (cityName: string) => {
    const city = majorCities.find(c => c.name === cityName);
    if (city) {
      onLocationChange(cityName, { lat: city.lat, lon: city.lon });
      setIsOpen(false);
    }
  };

  const handleCustomLocation = () => {
    if (customLocation.trim()) {
      // In a real app, you'd geocode this address
      // For now, we'll use Berlin as fallback
      onLocationChange(customLocation, { lat: 52.5200, lon: 13.4050 });
      setCustomLocation('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[160px]">
          <MapPin className="w-4 h-4 text-[#FF007F]" />
          <span className="truncate">{selectedLocation}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Standort auswählen</DialogTitle>
          <DialogDescription>
            Wählen Sie Ihren aktuellen Standort oder eine Stadt aus der Liste
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Current Location */}
          <Button
            onClick={handleUseCurrentLocation}
            disabled={gpsLoading}
            className="w-full justify-start bg-[#FF007F] hover:bg-[#FF007F]/90"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {gpsLoading ? 'Standort wird ermittelt...' : 'Aktuellen Standort verwenden'}
          </Button>

          {/* Major Cities */}
          <div>
            <h4 className="text-sm font-medium mb-2">Beliebte Städte</h4>
            <div className="grid grid-cols-2 gap-2">
              {majorCities.slice(0, 8).map((city) => (
                <Button
                  key={city.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCitySelect(city.name)}
                  className="justify-start text-xs"
                >
                  {city.name}
                </Button>
              ))}
            </div>
          </div>

          {/* All Cities Dropdown */}
          <div>
            <h4 className="text-sm font-medium mb-2">Alle Städte</h4>
            <Select onValueChange={handleCitySelect}>
              <SelectTrigger>
                <SelectValue placeholder="Stadt auswählen..." />
              </SelectTrigger>
              <SelectContent>
                {majorCities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Location */}
          <div>
            <h4 className="text-sm font-medium mb-2">Andere Stadt eingeben</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Stadt oder Postleitzahl eingeben..."
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomLocation()}
              />
              <Button onClick={handleCustomLocation} size="icon" variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}