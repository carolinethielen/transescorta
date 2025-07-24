// GPS location detection and distance calculation utilities

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  city: string;
  latitude: number;
  longitude: number;
}

// Calculate distance between two GPS coordinates in kilometers
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// Get user's current GPS location
export async function getCurrentLocation(): Promise<LocationCoords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  });
}

// Convert GPS coordinates to city name using reverse geocoding
export async function getCityFromCoords(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=de`
    );
    const data = await response.json();
    return data.city || data.locality || 'Unbekannte Stadt';
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return 'Unbekannte Stadt';
  }
}

// Get user's current location with city name
export async function getUserLocation(): Promise<LocationResult> {
  const coords = await getCurrentLocation();
  const city = await getCityFromCoords(coords.latitude, coords.longitude);
  
  return {
    city,
    latitude: coords.latitude,
    longitude: coords.longitude
  };
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)} km`;
  } else {
    return `${Math.round(distance)} km`;
  }
}