import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Try to get city name from coordinates using a reverse geocoding service
            // For demo purposes, we'll map coordinates to German cities
            let city = 'Berlin';
            if (latitude > 53.4 && latitude < 53.7 && longitude > 9.8 && longitude < 10.2) {
              city = 'Hamburg';
            } else if (latitude > 48.0 && latitude < 48.3 && longitude > 11.4 && longitude < 11.8) {
              city = 'München';
            } else if (latitude > 50.8 && latitude < 51.1 && longitude > 6.8 && longitude < 7.1) {
              city = 'Köln';
            }
            
            setLocation({
              latitude,
              longitude,
              city,
              country: 'Deutschland'
            });
          } catch (err) {
            setLocation({
              latitude,
              longitude,
              city: 'Berlin',
              country: 'Deutschland'
            });
          }
          
          setIsLoading(false);
        },
        (err) => {
          setError(err.message);
          // Default to Berlin if location access is denied
          setLocation({
            latitude: 52.5200,
            longitude: 13.4050,
            city: 'Berlin',
            country: 'Deutschland'
          });
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setError('Geolocation not supported');
      setLocation({
        latitude: 52.5200,
        longitude: 13.4050,
        city: 'Berlin',
        country: 'Deutschland'
      });
      setIsLoading(false);
    }
  }, []);

  return { location, isLoading, error };
}