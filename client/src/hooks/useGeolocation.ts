import { useState, useEffect } from 'react';

interface GeolocationState {
  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
  currentCity: string | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => void;
}

export function useGeolocation(): GeolocationState {
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to reverse geocode coordinates to city name
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      // Use a simple approach to detect German cities based on coordinates
      const germanCities = [
        { name: 'Berlin', lat: 52.5200, lon: 13.4050, radius: 50 },
        { name: 'Hamburg', lat: 53.5511, lon: 9.9937, radius: 40 },
        { name: 'München', lat: 48.1351, lon: 11.5820, radius: 35 },
        { name: 'Köln', lat: 50.9375, lon: 6.9603, radius: 30 },
        { name: 'Frankfurt am Main', lat: 50.1109, lon: 8.6821, radius: 25 },
        { name: 'Stuttgart', lat: 48.7758, lon: 9.1829, radius: 25 },
        { name: 'Düsseldorf', lat: 51.2277, lon: 6.7735, radius: 25 },
        { name: 'Leipzig', lat: 51.3397, lon: 12.3731, radius: 20 },
        { name: 'Dortmund', lat: 51.5136, lon: 7.4653, radius: 20 },
        { name: 'Essen', lat: 51.4556, lon: 7.0116, radius: 20 },
        { name: 'Bremen', lat: 53.0793, lon: 8.8017, radius: 20 },
        { name: 'Dresden', lat: 51.0504, lon: 13.7373, radius: 20 },
        { name: 'Hannover', lat: 52.3759, lon: 9.7320, radius: 20 },
        { name: 'Nürnberg', lat: 49.4521, lon: 11.0767, radius: 20 },
      ];

      // Calculate distance to each city and find the closest one
      for (const city of germanCities) {
        const distance = Math.sqrt(
          Math.pow((lat - city.lat) * 111, 2) + 
          Math.pow((lon - city.lon) * 111 * Math.cos(lat * Math.PI / 180), 2)
        );
        if (distance <= city.radius) {
          return city.name;
        }
      }
      
      return 'Deutschland'; // Fallback for other locations in Germany
    } catch (error) {
      return 'Deutschland';
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoordinates(coords);
        
        // Get city name from coordinates
        const city = await reverseGeocode(coords.latitude, coords.longitude);
        setCurrentCity(city);
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
        // Fallback to Berlin coordinates
        const fallbackCoords = {
          latitude: 52.5200,
          longitude: 13.4050,
        };
        setCoordinates(fallbackCoords);
        setCurrentCity('Berlin');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    coordinates,
    currentCity,
    isLoading,
    error,
    getCurrentLocation,
  };
}